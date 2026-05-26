import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Launch } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SpacexService {
  private apiUrl = 'https://api.spacexdata.com/v4/launches';

  constructor(private http: HttpClient) {}

  getPastLaunches(): Observable<Launch[]> {
    return this.http.get<Launch[]>(`${this.apiUrl}/past`);
  }

  getLaunchById(id: string): Observable<Launch> {
    return this.http.get<Launch>(`${this.apiUrl}/${id}`);
  }
}