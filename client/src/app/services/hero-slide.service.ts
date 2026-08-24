import { Injectable, inject, signal } from '@angular/core';
import { HeroSlide, HeroSlideInput } from '../types/hero-slide';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class HeroSlideService {
  private api = inject(ApiService);

  private _slides = signal<HeroSlide[]>([]);
  private _loading = signal(true);

  readonly slides = this._slides.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor() {
    this.refresh().finally(() => this._loading.set(false));
  }

  async refresh(): Promise<void> {
    const data = await this.api.get<HeroSlide[]>('/hero-slides');
    this._slides.set(data);
  }

  async addSlide(input: HeroSlideInput): Promise<void> {
    await this.api.post('/hero-slides', input);
    await this.refresh();
  }

  async updateSlide(id: string, input: HeroSlideInput): Promise<void> {
    await this.api.put(`/hero-slides/${id}`, input);
    await this.refresh();
  }

  async deleteSlide(id: string): Promise<void> {
    await this.api.delete(`/hero-slides/${id}`);
    await this.refresh();
  }

  async moveSlide(id: string, direction: 'up' | 'down'): Promise<void> {
    const updated = await this.api.patch<HeroSlide[]>(`/hero-slides/${id}/move`, { direction });
    this._slides.set(updated);
  }
}
