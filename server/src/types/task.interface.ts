import { Schema } from "mongoose";

export interface Task {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  userId: Schema.Types.ObjectId;
  boardId: Schema.Types.ObjectId;
  columnId: Schema.Types.ObjectId;
}

export interface TaskDocument extends Document, Task {}
