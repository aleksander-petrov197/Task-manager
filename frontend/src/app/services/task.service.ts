import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
private apiUrl = 'http://localhost:3000/tasks';
  constructor(private http: HttpClient) { }
  getTasks():Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
  addTasks(title: string): Observable<any>{
   return this.http.post(this.apiUrl, { title });
  }
  deleteTask(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
  updateTask(id: number, updates: Partial<any>): Observable<any>{
    return this.http.patch(`${this.apiUrl}/${id}`, updates);
  }
}
