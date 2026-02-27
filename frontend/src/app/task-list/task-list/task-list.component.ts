import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './../../services/task.service';
import { Router } from '@angular/router';
import {DragDropModule, moveItemInArray, CdkDragDrop} from '@angular/cdk/drag-drop'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  title = 'task-tracker'
  tasks = signal<any[]>([]);
  newTaskTitle = '';
  errorMessage: string |null = null;
  newTaskDate: string = '';
  minDate: string = new Date().toISOString().split('T')[0];
  constructor(private taskService: TaskService, private router: Router) { }
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
  loadTasks() {
  this.taskService.getTasks().subscribe({
    next: (data) => {
      this.tasks.set(data); 
    },
    error: (err) => console.error('Could not load tasks', err)
  });
}


addTask() {
  this.errorMessage = null;

 
  if (!this.newTaskTitle || !this.newTaskTitle.trim()) {
    this.errorMessage = "Please enter a task title.";
    return;
  }

  
  if (!this.newTaskDate) {
    this.errorMessage = "Please select a due date.";
    return;
  }


  this.taskService.addTask(this.newTaskTitle, this.newTaskDate).subscribe({
    next: () => {
      this.newTaskTitle = '';
      this.newTaskDate = '';
      this.loadTasks();
    },
    error: (err) => {
      this.errorMessage = "Server error. Could not save task.";
    }
  });
}
saveEdit(task: any) {
  if (!this.newTaskTitle || !this.newTaskTitle.trim()) {
    alert("Please enter a task title."); 
    return; 
  }
  this.taskService.updateTask(task.id, { 
    title: task.title, 
    dueDate: task.dueDate 
  }).subscribe({
    next: () => {
      task.isEditing = false;
      this.loadTasks();
    }
  });
}
  deleteTask(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this task? This cannot be undone.');

  if (confirmed) {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => (this.errorMessage = "Could not delete task.")
    });
  }
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }
 toggleDone(task: any) {
  const newStatus = task.status === 'DONE' ? 'PENDING' : 'DONE';
  
 this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
    next: () => this.loadTasks(),
    error: (err) => console.error(err)
  });
}
  
  filter = signal<'ALL' | 'PENDING' | 'DONE'>('ALL');
  filteredTasks = computed(() => {
    const all = this.tasks();
    const f = this.filter();



    if (f === 'ALL') return all;

    if (f === 'PENDING') {
      return all.filter(t => {
        const s = t.status?.toLowerCase();
        return s === 'pending' || s === 'open';
      }
      )
    }

    if (f === 'DONE') {
      return all.filter(t => t.status?.toLowerCase() === 'done');
    }

    return all;
  });
  setFilter(newFIlter: 'ALL' | 'PENDING' | 'DONE') {
    this.filter.set(newFIlter)
  }
  isOverdue(dateStr: string): boolean {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    return dueDate < today;
  }
 drop(event: CdkDragDrop<any[]>) {

  const currentTasks = [...this.tasks()];
  
 
  moveItemInArray(currentTasks, event.previousIndex, event.currentIndex);
  

  this.tasks.set(currentTasks);

  
  currentTasks.forEach((task, index) => {
   
    this.taskService.updateTask(task.id, { position: index }).subscribe({
      next: () => console.log(`Task ${task.id} is now position ${index}`),
      error: (err) => console.error('Error syncing position', err)
    });
  });
}

}
