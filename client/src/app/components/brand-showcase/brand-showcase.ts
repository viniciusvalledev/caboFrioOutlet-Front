import { Component, inject, output } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-brand-showcase',
  templateUrl: './brand-showcase.html',
})
export class BrandShowcase {
  settingsService = inject(SettingsService);

  selectBrand = output<string>();

  handleClick(label: string): void {
    this.selectBrand.emit(label);
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  }
}
