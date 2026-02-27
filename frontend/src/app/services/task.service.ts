import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
private apiUrl = 'http://localhost:3000/tasks';
  constructor(private http: HttpClient) { }
  private getHeaders(){
    const token = localStorage.getItem('token');
    return{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }
  }
  
  getTasks(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
 
  return this.http.get<any[]>(this.apiUrl, { headers });
}
  addTask(title: string, dueDate?: string): Observable<any>{
   return this.http.post(this.apiUrl, { title, dueDate }, this.getHeaders());
  }
  deleteTask(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders())
  }
  updateTask(id: number, updates: Partial<any>): Observable<any>{
    return this.http.patch(`${this.apiUrl}/${id}`, updates, this.getHeaders());
  }
  
}
