import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Link {
  code: string;
  url: string;
  shortUrl: string;
  hits: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class LinkService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000';

  createLink(url: string): Observable<Link> {
    return this.http.post<Link>(`${this.api}/api/links`, { url });
  }

  getLinks(): Observable<Link[]> {
    return this.http.get<Link[]>(`${this.api}/api/links`);
  }
}
