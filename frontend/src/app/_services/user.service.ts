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

  public getUserMaintainabilityStat(username) {
    const url = `${this.apiBaseUrl}/code/${username}/repos/all/formatted`;
    return this.http.get(url);
  }

  public getDebugStat(username) {
    const url = `${this.apiBaseUrl}/users/${username}/repo/issues/objects`;
    return this.http.get(url);
  }

  public getGeneralStat(username) {
    const url = `${this.apiBaseUrl}/users/${username}/general-statistic`;
    return this.http.get(url);
  }

  constructor(
    private http: HttpClient
  ) { }
}
