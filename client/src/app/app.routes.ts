import { Routes } from '@angular/router';
import { StorefrontPage } from './pages/storefront-page/storefront-page';
import { AdminPage } from './pages/admin-page/admin-page';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: StorefrontPage },
  { path: 'admin', component: AdminPage, canActivate: [adminGuard] },
];
