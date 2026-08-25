import { Component, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SettingsService } from '../../services/settings.service';
import { AdminDashboard } from '../../components/admin/admin-dashboard/admin-dashboard';

@Component({
  selector: 'app-admin-page',
  imports: [AdminDashboard],
  templateUrl: './admin-page.html',
})
export class AdminPage {
  private settingsService = inject(SettingsService);
  private titleService = inject(Title);

  constructor() {
    effect(() => {
      this.titleService.setTitle(`${this.settingsService.settings().storeName} | admin dashboard`);
    });
  }
}
