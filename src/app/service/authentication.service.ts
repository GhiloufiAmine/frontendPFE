import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefUser } from '../model/DefUser';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string = '';
  private loggedInUsername: string = '';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public login(user: DefUser): Observable<HttpResponse<DefUser>> {
    return this.http.post<DefUser> (`${this.host}/user/login`, user, { observe: 'response' });
  }

  public register(user: DefUser): Observable<DefUser> {
    return this.http.post<DefUser>(`${this.host}/user/register`, user);
  }

  public logOut(): void {
    this.token = '';
    this.loggedInUsername = '';
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('users')

  }

  public saveToken(token: string): void {
    this.token = token;
    this.loggedInUsername = '';
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: DefUser): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): DefUser | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token') ?? '';
  }

  public getToken(): string {
    return this.token;
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if(this.token != null && this.token!='') {
      if(this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if(!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    }
    else {
      this.logOut();
    }
    return false;
  }
}