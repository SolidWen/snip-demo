import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LinkService, Link } from './link.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private svc = inject(LinkService);

  urlInput = signal('');
  allLinks = signal<Link[]>([]);
  newLink = signal<Link | null>(null);
  formError = signal<string | null>(null);
  submitting = signal(false);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.svc.getLinks().subscribe({
      next: (list) => this.allLinks.set(list),
      error: () => {},
    });
  }

  submit() {
    const raw = this.urlInput().trim();
    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      this.formError.set('Enter a valid URL.');
      return;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      this.formError.set('Only http:// and https:// URLs are allowed.');
      return;
    }

    this.formError.set(null);
    this.newLink.set(null);
    this.submitting.set(true);

    this.svc.createLink(raw).subscribe({
      next: (link) => {
        this.newLink.set(link);
        this.urlInput.set('');
        this.submitting.set(false);
        this.refresh();
      },
      error: (err: HttpErrorResponse) => {
        this.formError.set(err.error?.error ?? 'Network error — is the backend running?');
        this.submitting.set(false);
      },
    });
  }
}
