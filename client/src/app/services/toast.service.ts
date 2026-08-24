import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  showToast(title: string, description?: string): void {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this._toasts.update((prev) => [...prev, { id, title, description }]);
    setTimeout(() => {
      this._toasts.update((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  /** Toast de confirmação: fica na tela até o usuário confirmar ou cancelar (sem fechar sozinho). */
  showConfirm(
    title: string,
    description: string | undefined,
    onConfirm: () => void,
    options?: { confirmLabel?: string; cancelLabel?: string }
  ): void {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this._toasts.update((prev) => [
      ...prev,
      {
        id,
        title,
        description,
        onConfirm,
        confirmLabel: options?.confirmLabel ?? 'Remover',
        cancelLabel: options?.cancelLabel ?? 'Cancelar',
      },
    ]);
  }

  confirmToast(id: string): void {
    const toast = this._toasts().find((t) => t.id === id);
    this.dismissToast(id);
    toast?.onConfirm?.();
  }

  dismissToast(id: string): void {
    this._toasts.update((prev) => prev.filter((t) => t.id !== id));
  }
}
