import { Component, HostBinding, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { SocketService } from 'src/app/shared/services/socket.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { SocketEventsEnum } from 'src/app/shared/types/socketEvents.enum';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import { BoardService } from '../../service/board.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<TaskInterface>;
  data$: Observable<{ task: TaskInterface; columns: ColumnInterface[] }>;
  columnForm = this.fb.group({
    columnId: [''],
  });
  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private fb: FormBuilder,
    private tasksService: TasksService,
    private socketService: SocketService
  ) {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error("Can't get board ID from URL");
    }

    if (!taskId) {
      throw new Error("Can't get task ID from URL");
    }

    this.taskId = taskId;
    this.boardId = boardId;
    this.task$ = this.boardService.tasks$.pipe(
      map((tasks) => {
        return tasks.find((task) => task.id === this.taskId);
      }),
      filter(Boolean)
    );
    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => ({
        task,
        columns,
      }))
    );
    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe((task) => {
      this.columnForm.patchValue({
        columnId: task.columnId,
      });
    });

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (task.columnId !== columnId) {
          this.tasksService.updateTask(this.boardId, task?.id, { columnId });
        }
      });

    this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.goToBoard();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }

  updateTaskName(taskName: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      title: taskName,
    });
  }
  updateTaskDescription(taskDescription: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      description: taskDescription,
    });
  }
  deleteTask(): void {
    this.tasksService.deleteTask(this.boardId, this.taskId);
  }
}
