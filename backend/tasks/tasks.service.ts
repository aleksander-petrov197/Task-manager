import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
async update(id: number, updateTaskDto: any) {
  console.log('Force updating ID:', id, 'with data:', updateTaskDto);

 
  await this.taskRepository
    .createQueryBuilder()
    .update(Task)
    .set(updateTaskDto) 
    .where("id = :id", { id })
    .execute();

  return this.findOne(id);
}
  async remove(id: number): Promise<Task> {
    const task = await this.findOne(id);
    return this.taskRepository.remove(task);
  }
  async findAll(userId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { user: { id: userId } },
      order: {position: 'ASC'}
    });
  }
  async create(title: string, userId: number, dueDate?: string) {

    if(dueDate){
      const today = new Date();
      today.setHours(0,0,0,0)
      const selectDate = new Date(dueDate);
      const count = await this.taskRepository.count({
        where:{user:{id: userId}}
      });

      if(selectDate < today){
        throw new BadRequestException('You cannot set a task for a past date.')
      }
    }
    const newTask = this.taskRepository.create({
      title,
      dueDate,
      user: { id: userId },
      status: 'OPEN',
    });
    return await this.taskRepository.save(newTask);
  }
async reorderTasks(ids: number[]) {

  const updates = ids.map((id, index) => 
    this.taskRepository.update(id, { position: index })
  );
  return await Promise.all(updates);
}
}