export interface HeroSlide {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaLabel: string;
  order: number;
  createdAt: string;
}

export interface HeroSlideInput {
  image: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  ctaLabel?: string;
}
