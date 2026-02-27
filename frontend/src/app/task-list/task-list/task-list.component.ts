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
      this.tasks.set(data); // This updates the signal with the DB's sorted order
    },
    error: (err) => console.error('Could not load tasks', err)
  });
}
  addTask() {
    console.log('Add button clicked! Current title:', this.newTaskTitle);
    if (!this.newTaskTitle || !this.newTaskTitle.trim()) {
    alert("Please enter a task title."); 
    return;
  }
    this.taskService.addTask(this.newTaskTitle, this.newTaskDate).subscribe(() => {
      this.newTaskTitle = '';
      this.newTaskDate = '';
      this.loadTasks()
    })
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
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }
  toggleDone(task: any) {
    const newStatus = task.status === 'DONE' ? 'OPEN' : 'DONE';
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => this.loadTasks()
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
  // 1. Get a copy of the current tasks
  const currentTasks = [...this.tasks()];
  
  // 2. Move the item in the local array
  moveItemInArray(currentTasks, event.previousIndex, event.currentIndex);
  
  // 3. Update the UI Signal immediately
  this.tasks.set(currentTasks);

  // 4. THE FIX: Loop through all tasks and sync their NEW positions to the DB
  currentTasks.forEach((task, index) => {
    // We call your service's updateTask for EVERY item in the list
    this.taskService.updateTask(task.id, { position: index }).subscribe({
      next: () => console.log(`Task ${task.id} is now position ${index}`),
      error: (err) => console.error('Error syncing position', err)
    });
  });
}

}
