import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { CurrentUserInterface } from '../types/currentUser.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { registerRequestInterface } from '../types/registerRequest.interface';
import { LoginRequestInterface } from '../types/loginRequest.interface';
import { SocketService } from 'src/app/shared/services/socket.service';

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(
    undefined
  );

  isLogged$ = this.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map(Boolean)
  );
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = `${environment.api}/user`;

    return this.http.get<CurrentUserInterface>(url);
  }

  setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser$.next(currentUser);
  }

  register(
    registerRequest: registerRequestInterface
  ): Observable<CurrentUserInterface> {
    const url = `${environment.api}/users`;

    return this.http.post<CurrentUserInterface>(url, registerRequest);
  }

  setToken(currentUser: CurrentUserInterface): void {
    localStorage.setItem('token', currentUser.token);
  }

  login(loginRequest: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = `${environment.api}/users/login`;

    return this.http.post<CurrentUserInterface>(url, loginRequest);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser$.next(null);
    this.socketService.disconnect();
  }
}
