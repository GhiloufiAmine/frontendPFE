import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefUser } from '../model/DefUser';
import { CustomHttpResponse } from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;

  constructor( private http: HttpClient) {}

  public getUsers(): Observable<DefUser[] | HttpErrorResponse> {
    return this.http.get<DefUser[]>(`${this.host}/user/list`);
  }

  public addUser(formData: FormData): Observable<DefUser | HttpErrorResponse> {
    return this.http.post<DefUser>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<DefUser | HttpErrorResponse> {
    return this.http.post<DefUser>(`${this.host}/user/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/user/resetpassword/${email}`);
  }

  public deleteUser(user_id: number): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.delete<any>(`${this.host}/user/delete/${user_id}`);
  }

  public addUsersToLocalCache(users: DefUser[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): DefUser[] {
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      try {
        const users = JSON.parse(usersJson) as DefUser[];
        if (Array.isArray(users)) {
          return users;
        }
      } catch (e) {
        console.error('Error parsing stored users: ', e);
      }
    }
    return [];
  }

  public createUserFormData(loggedInUsername: string, user: DefUser): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('isActive', JSON.stringify(user.isActive));
    formData.append('isNotLocked', JSON.stringify(user.isNotLocked));
    formData.append('role', user.role);
    return formData;
  }
}