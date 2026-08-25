import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { requireAdmin, requireAuth, optionalAuth } from '../middleware/auth';

export const ordersRouter = Router();

interface OrderItemInput {
  productId: string;
  size: string;
  quantity: number;
}

const VALID_STATUSES = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];

ordersRouter.get('/', requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

// Pedidos do cliente logado (usados na tela "Meus pedidos").
ordersRouter.get('/mine', requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.sub },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

// Cria o pedido, calcula os preços a partir do catálogo (nunca confia no preço enviado
// pelo cliente) e baixa o estoque de forma atômica — se faltar estoque, tudo é revertido.
// Aceita tanto clientes logados (o pedido fica vinculado à conta) quanto visitantes.
ordersRouter.post('/', optionalAuth, async (req, res) => {
  const { customerName, customerContact, items } = req.body as {
    customerName?: string;
    customerContact?: string;
    items?: OrderItemInput[];
  };

  if (!customerName?.trim() || !customerContact?.trim() || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Preencha nome, contato e ao menos um item.' });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

      for (const item of items) {
        const { productId, size, quantity } = item;
        if (!productId || !size || !quantity || quantity <= 0) {
          throw new Error('Item de pedido inválido.');
        }

        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product) {
          throw new Error('Um dos produtos do carrinho não existe mais.');
        }

        const productSize = await tx.productSize.findUnique({
          where: { productId_size: { productId, size } },
        });
        if (!productSize || productSize.stock < quantity) {
          throw new Error(`Estoque insuficiente para "${product.name}" (tamanho ${size}).`);
        }

        await tx.productSize.update({
          where: { id: productSize.id },
          data: { stock: { decrement: quantity } },
        });

        const unitPrice = product.discountPercent
          ? product.price * (1 - product.discountPercent / 100)
          : product.price;
        total += unitPrice * quantity;

        orderItemsData.push({
          product: { connect: { id: product.id } },
          productName: product.name,
          image: product.image,
          size,
          quantity,
          unitPrice,
        });
      }

      return tx.order.create({
        data: {
          customerName: customerName.trim(),
          customerContact: customerContact.trim(),
          total,
          status: 'pendente',
          items: { create: orderItemsData },
          userId: req.user?.sub,
        },
        include: { items: true },
      });
    });

    res.status(201).json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao processar o pedido.';
    res.status(400).json({ error: message });
  }
});

ordersRouter.patch('/:id/status', requireAdmin, async (req, res) => {
  const id = req.params.id as string;
  const { status } = req.body as { status?: string };

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    res.json(order);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    throw err;
  }
});
