import { Component } from '@angular/core';

const BANNERS = [
  {
    title: 'Nova Coleção',
    image: 'https://images.unsplash.com/photo-1635650804060-bb009bcb2ea5?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Mais Vendidos',
    image: 'https://images.unsplash.com/photo-1574427797991-b086946fa9e7?w=1200&auto=format&fit=crop&q=80',
  },
];

@Component({
  selector: 'app-brand-banner',
  templateUrl: './brand-banner.html',
})
export class BrandBanner {
  readonly banners = BANNERS;

  scrollToProducts(): void {
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  }
}
