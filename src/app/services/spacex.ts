import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpacexService {
  private apiUrl = 'https://api.spacexdata.com/v4/launches';

  constructor(private http: HttpClient) {}

  getPastLaunches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/past`);
  }

  getLaunchById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}