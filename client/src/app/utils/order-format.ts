import { OrderStatus } from '../types/order';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export const STATUS_STYLES: Record<OrderStatus, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregue: 'bg-emerald-50 text-emerald-600',
  cancelado: 'bg-red-50 text-red-600',
};

export function formatOrderPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
