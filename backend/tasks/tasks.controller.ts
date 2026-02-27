import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard, IAuthGuard, Type } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(
    @Body() body: { title: string; dueDate?: string },
    @Req() req: any
  ) {
    const userId = req.user.userId;
    const { title, dueDate } = body;
console.log('Request User:', req.user);

    return this.tasksService.create(title, userId, dueDate);
  }

  @Get()

findAll(@Req() req: any) {
  const userId = req.user.userId; 
  console.log('Fetching tasks for user:', userId);
  return this.tasksService.findAll(userId);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

}


