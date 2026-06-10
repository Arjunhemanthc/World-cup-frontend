import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, map, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5014/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Try to load user from local storage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('currentUser');
    if (token && userStr) {
      this.currentUserSubject.next(JSON.parse(userStr));
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        const user: User = { id: res.id, email: res.email, role: res.role };
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  register(name: string, email: string, password: string): Observable<{ success: boolean, message?: string }> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password }).pipe(
      map(() => ({ success: true })),
      catchError(err => of({ success: false, message: err.error?.message || 'Registration failed.' }))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
