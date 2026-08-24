import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ArrowRight, ChevronLeft, ChevronRight, Truck, RefreshCcw, CreditCard } from 'lucide-angular';
import { HeroSlideService } from '../../services/hero-slide.service';

const TRUST_ITEMS = [
  { icon: Truck, label: 'Frete grátis acima de R$ 299' },
  { icon: RefreshCcw, label: 'Troca grátis em 30 dias' },
  { icon: CreditCard, label: 'Até 3x sem juros' },
];

const AUTOPLAY_MS = 7000;

@Component({
  selector: 'app-hero',
  imports: [LucideAngularModule],
  templateUrl: './hero.html',
})
export class Hero implements OnDestroy {
  heroSlideService = inject(HeroSlideService);

  readonly ArrowRight = ArrowRight;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly trustItems = TRUST_ITEMS;

  activeIndex = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  readonly currentSlide = computed(() => {
    const slides = this.heroSlideService.slides();
    if (slides.length === 0) return null;
    const index = Math.min(this.activeIndex(), slides.length - 1);
    return slides[index];
  });

  constructor() {
    this.timer = setInterval(() => this.next(), AUTOPLAY_MS);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  next(): void {
    const total = this.heroSlideService.slides().length;
    if (total === 0) return;
    this.activeIndex.update((i) => (i + 1) % total);
  }

  prev(): void {
    const total = this.heroSlideService.slides().length;
    if (total === 0) return;
    this.activeIndex.update((i) => (i - 1 + total) % total);
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
  }

  scrollToProducts(): void {
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  }
}
