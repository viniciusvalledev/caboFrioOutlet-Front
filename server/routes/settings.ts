import { Router } from 'express';
import { prisma } from '../db';
import { requireAdmin } from '../middleware/auth';

export const settingsRouter = Router();

function parseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function serialize(settings: {
  storeName: string;
  freeShippingThreshold: number;
  announcementMessages: string;
  brands: string;
}) {
  return {
    storeName: settings.storeName,
    freeShippingThreshold: settings.freeShippingThreshold,
    announcementMessages: parseJsonArray(settings.announcementMessages),
    brands: parseJsonArray(settings.brands),
  };
}

settingsRouter.get('/', async (_req, res) => {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, announcementMessages: '[]', brands: '[]' },
  });
  res.json(serialize(settings));
});

settingsRouter.put('/', requireAdmin, async (req, res) => {
  const { storeName, freeShippingThreshold, announcementMessages, brands } = req.body as {
    storeName?: string;
    freeShippingThreshold?: number;
    announcementMessages?: string[];
    brands?: string[];
  };

  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      ...(storeName?.trim() ? { storeName: storeName.trim() } : {}),
      ...(typeof freeShippingThreshold === 'number' && freeShippingThreshold > 0
        ? { freeShippingThreshold }
        : {}),
      ...(Array.isArray(announcementMessages)
        ? { announcementMessages: JSON.stringify(announcementMessages) }
        : {}),
      ...(Array.isArray(brands) ? { brands: JSON.stringify(brands) } : {}),
    },
    create: {
      id: 1,
      storeName: storeName?.trim() || undefined,
      freeShippingThreshold: freeShippingThreshold || undefined,
      announcementMessages: JSON.stringify(announcementMessages ?? []),
      brands: JSON.stringify(brands ?? []),
    },
  });

  res.json(serialize(settings));
});
