export type OrderStatus = 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  image: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerContact: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  userId?: string | null;
}
