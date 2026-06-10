import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Team, Poll } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = 'http://localhost:5014/api';

  constructor(private http: HttpClient) {}

  // State cache
  private teamsCache: Team[] | null = null;
  private userPollCache: Poll | null = null;
  private hasFetchedUserPoll = false;
  private resultsCache: any | null = null;
  private adminStatsCache: any | null = null;

  // -- Teams --
  getTeams(forceRefresh = false): Observable<Team[]> {
    if (!forceRefresh && this.teamsCache) {
      return of(this.teamsCache);
    }
    return this.http.get<Team[]>(`${this.apiUrl}/teams?t=${new Date().getTime()}`).pipe(
      tap(teams => this.teamsCache = teams)
    );
  }

  addTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/teams`, team).pipe(
      tap(() => { this.teamsCache = null; this.adminStatsCache = null; })
    );
  }

  updateTeam(id: string, team: Team): Observable<any> {
    return this.http.put(`${this.apiUrl}/teams/${id}`, team).pipe(
      tap(() => { this.teamsCache = null; this.adminStatsCache = null; })
    );
  }

  deleteTeam(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teams/${id}`).pipe(
      tap(() => { this.teamsCache = null; this.adminStatsCache = null; })
    );
  }

  // -- Polls --
  submitPoll(teamId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/polls`, { teamId }).pipe(
      tap((res: any) => { 
        this.userPollCache = res.poll; 
        this.hasFetchedUserPoll = true;
        this.resultsCache = null;
        this.adminStatsCache = null;
      })
    );
  }

  getUserPoll(forceRefresh = false): Observable<Poll> {
    if (!forceRefresh && this.hasFetchedUserPoll) {
      return of(this.userPollCache as Poll);
    }
    return this.http.get<Poll>(`${this.apiUrl}/polls/my-poll?t=${new Date().getTime()}`).pipe(
      tap(poll => {
        this.userPollCache = poll;
        this.hasFetchedUserPoll = true;
      })
    );
  }

  getResults(forceRefresh = false): Observable<any> {
    if (!forceRefresh && this.resultsCache) {
      return of(this.resultsCache);
    }
    return this.http.get<any>(`${this.apiUrl}/polls/result?t=${new Date().getTime()}`).pipe(
      tap(res => this.resultsCache = res)
    );
  }

  // -- Admin --
  resetPoll(): Observable<any> {
    return this.http.post(`${this.apiUrl}/polls/reset`, {}).pipe(
      tap(() => {
        // Clear all caches since everything is wiped
        this.teamsCache = null;
        this.userPollCache = null;
        this.hasFetchedUserPoll = false;
        this.resultsCache = null;
        this.adminStatsCache = null;
      })
    );
  }

  revealResults(winningTeamId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/reveal`, { winningTeamId }).pipe(
      tap(() => { 
        this.resultsCache = null;
        this.adminStatsCache = null;
      })
    );
  }

  getAdminStats(forceRefresh = false): Observable<any> {
    if (!forceRefresh && this.adminStatsCache) {
      return of(this.adminStatsCache);
    }
    return this.http.get<any>(`${this.apiUrl}/admin/stats?t=${new Date().getTime()}`).pipe(
      tap(stats => this.adminStatsCache = stats)
    );
  }
}
