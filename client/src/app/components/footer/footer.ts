import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Instagram, ArrowRight } from 'lucide-angular';
import { ToastService } from '../../services/toast.service';
import { SettingsService, splitStoreName } from '../../services/settings.service';

const LINK_COLUMNS = [
  { title: 'Institucional', links: ['Sobre nós', 'Contato', 'Trabalhe conosco'] },
  { title: 'Ajuda', links: ['Trocas e devoluções', 'Perguntas frequentes', 'Guia de medidas'] },
  { title: 'Categorias', links: ['Camisas', 'Calças', 'Bermudas', 'Bonés'] },
];

@Component({
  selector: 'app-footer',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  private toastService = inject(ToastService);
  settingsService = inject(SettingsService);

  readonly Instagram = Instagram;
  readonly ArrowRight = ArrowRight;
  readonly linkColumns = LINK_COLUMNS;
  readonly splitStoreName = splitStoreName;
  readonly currentYear = new Date().getFullYear();
  readonly instagramUrl = 'https://www.instagram.com/cabofrio.outlet';

  email = signal('');

  handleSubscribe(event: Event): void {
    event.preventDefault();
    if (!this.email()) return;
    this.toastService.showToast('Inscrição confirmada!', 'Você vai receber nossas novidades em breve.');
    this.email.set('');
  }
}
