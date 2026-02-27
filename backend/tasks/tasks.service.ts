import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) { }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    const updated = Object.assign(task, updateTaskDto);
    return this.taskRepository.save(updated);
  }
  async remove(id: number): Promise<Task> {
    const task = await this.findOne(id);
    return this.taskRepository.remove(task);
  }
  async findAll(userId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { user: { id: userId } }
    });
  }
  async create(title: string, userId: number) {
    const newTask = this.taskRepository.create({
      title,
      user: { id: userId }
    });
    return await this.taskRepository.save(newTask);
  }

}