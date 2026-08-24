import { Component, computed, inject } from '@angular/core';
import { LucideAngularModule, CircleCheckBig, TriangleAlert, X } from 'lucide-angular';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-stack',
  imports: [LucideAngularModule],
  templateUrl: './toast-stack.html',
})
export class ToastStack {
  toastService = inject(ToastService);

  readonly CircleCheckBig = CircleCheckBig;
  readonly TriangleAlert = TriangleAlert;
  readonly X = X;

  readonly infoToasts = computed(() => this.toastService.toasts().filter((t) => !t.onConfirm));
  readonly confirmToasts = computed(() => this.toastService.toasts().filter((t) => Boolean(t.onConfirm)));
}
