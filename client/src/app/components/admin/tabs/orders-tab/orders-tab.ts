import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ChevronDown, ChevronUp, Receipt, Clock, CircleCheckBig } from 'lucide-angular';
import { Order, OrderStatus } from '../../../../types/order';
import { ApiService } from '../../../../services/api.service';
import { ToastService } from '../../../../services/toast.service';
import { ApiError } from '../../../../services/api-error';
import { StatCard } from '../../stat-card/stat-card';

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregue: 'bg-emerald-50 text-emerald-600',
  cancelado: 'bg-red-50 text-red-600',
};

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

@Component({
  selector: 'app-orders-tab',
  imports: [LucideAngularModule, StatCard],
  templateUrl: './orders-tab.html',
})
export class OrdersTab implements OnInit {
  private api = inject(ApiService);
  private toastService = inject(ToastService);

  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly Receipt = Receipt;
  readonly Clock = Clock;
  readonly CircleCheckBig = CircleCheckBig;
  readonly statusOptions = STATUS_OPTIONS;
  readonly statusStyles = STATUS_STYLES;
  readonly formatPrice = formatPrice;
  readonly formatDate = formatDate;

  orders = signal<Order[]>([]);
  loading = signal(true);
  expandedId = signal<string | null>(null);

  readonly stats = computed(() => {
    const orders = this.orders();
    return {
      total: orders.length,
      pendentes: orders.filter((o) => o.status === 'pendente').length,
      faturamento: Math.round(
        orders.filter((o) => o.status !== 'cancelado').reduce((sum, o) => sum + o.total, 0)
      ),
    };
  });

  ngOnInit(): void {
    this.api
      .get<Order[]>('/orders')
      .then((data) => this.orders.set(data))
      .catch((err) =>
        this.toastService.showToast('Erro ao carregar pedidos', err instanceof ApiError ? err.message : undefined)
      )
      .finally(() => this.loading.set(false));
  }

  toggleExpanded(orderId: string): void {
    this.expandedId.update((current) => (current === orderId ? null : orderId));
  }

  async handleStatusChange(order: Order, status: OrderStatus): Promise<void> {
    const previous = this.orders();
    this.orders.update((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    try {
      await this.api.patch(`/orders/${order.id}/status`, { status });
    } catch (err) {
      this.orders.set(previous);
      this.toastService.showToast('Erro ao atualizar status', err instanceof ApiError ? err.message : undefined);
    }
  }
}
