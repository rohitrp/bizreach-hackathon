import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiBaseUrl = environment.apiBaseUrl;

  public getUserStat(username) {
    const url = `${this.apiBaseUrl}/users/${username}/stats`;
    return this.http.get(url);
  }
  constructor(
    private http: HttpClient
  ) { }
}
