import { Component, computed, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './../../services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  title = 'task-tracker'
tasks = signal<any[]>([]);
newTaskTitle = '';

constructor(private taskService: TaskService, private router: Router){}
onLogout() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}
ngOnInit() {
  const token = localStorage.getItem('token');
  if (token) {
    this.loadTasks();
  } else {
    this.router.navigate(['/login']);
  }
}
loadTasks(){
  this.taskService.getTasks().subscribe(data => this.tasks.set(data));

}

addTasks(){
  if(!this.newTaskTitle.trim()) return;
  this.taskService.addTasks(this.newTaskTitle).subscribe(()=>{
    this.newTaskTitle = '',
    this.loadTasks();

  });
}
deleteTask(id: number){
  this.taskService.deleteTask(id).subscribe(()=> this.loadTasks());
}
toggleDone(task:any){
const newStatus = task.status === 'DONE' ? 'OPEN' : 'DONE';
this.taskService.updateTask(task.id,{status: newStatus}).subscribe({
  next: () => this.loadTasks()
});
}
editTask(task: any){
  const newTaskTitle = prompt('Édit Task Title: ', task.title);
  if(newTaskTitle && newTaskTitle.trim() !== task.title){
    this.taskService.updateTask(task.id, {title: newTaskTitle}).subscribe({
      next: ()=> this.loadTasks()
    });
  }
}
filter = signal<'ALL' | 'PENDING' | 'DONE'  >('ALL');
filteredTasks = computed(() => {
  const all = this.tasks();
  const f = this.filter();

  console.log('Current Filter:', f);
  console.log('All Tasks:', all);

  if (f === 'ALL') return all;

  if (f === 'PENDING') {
    return all.filter(t =>
    {
      const s  = t.status?.toLowerCase();
      return s === 'pending' || s === 'open';
    }
    )
  }

  if (f === 'DONE') {
    return all.filter(t => t.status?.toLowerCase() === 'done');
  }

  return all;
});
setFilter(newFIlter: 'ALL'| 'PENDING' | 'DONE'){
  this.filter.set(newFIlter)
}

}
