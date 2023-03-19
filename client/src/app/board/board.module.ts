import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/services/authGuard.service';
import { BoardService } from './service/board.service';
import { ColumnsService } from '../shared/services/columns.service';
import { TopbarModule } from '../shared/modules/topbar/topbar.module';
import { InlineFormModule } from '../shared/modules/inline-form/inline-form.module';
import { TasksService } from '../shared/services/tasks.service';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'boards/:boardId',
    component: BoardComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModalComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [BoardComponent, TaskModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TopbarModule,
    InlineFormModule,
    ReactiveFormsModule,
  ],
  providers: [BoardService, ColumnsService, TasksService],
})
export class BoardModule {}
