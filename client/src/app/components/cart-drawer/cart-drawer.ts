import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-angular';
import { CartService, getDiscountedPrice } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductService } from '../../services/product.service';
import { ApiService } from '../../services/api.service';
import { ApiError } from '../../services/api-error';

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

@Component({
  selector: 'app-cart-drawer',
  imports: [LucideAngularModule],
  templateUrl: './cart-drawer.html',
})
export class CartDrawer {
  cartService = inject(CartService);
  private toastService = inject(ToastService);
  private productService = inject(ProductService);
  private api = inject(ApiService);

  readonly X = X;
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly ShoppingBag = ShoppingBag;
  readonly formatPrice = formatPrice;
  readonly getDiscountedPrice = getDiscountedPrice;

  customerName = signal('');
  customerContact = signal('');
  submitting = signal(false);

  async handleCheckout(event: Event): Promise<void> {
    event.preventDefault();
    const name = this.customerName().trim();
    const contact = this.customerContact().trim();
    if (!name || !contact || this.submitting()) return;

    this.submitting.set(true);
    try {
      await this.api.post('/orders', {
        customerName: name,
        customerContact: contact,
        items: this.cartService.items().map((item) => ({
          productId: item.product.id,
          size: item.selectedSize,
          quantity: item.quantity,
        })),
      });

      this.toastService.showToast('Pedido confirmado!', 'Em breve entraremos em contato com você.');
      this.cartService.clearCart();
      this.customerName.set('');
      this.customerContact.set('');
      this.cartService.closeCart();
      this.productService.refresh();
    } catch (err) {
      this.toastService.showToast(
        'Não foi possível concluir o pedido',
        err instanceof ApiError ? err.message : undefined
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
