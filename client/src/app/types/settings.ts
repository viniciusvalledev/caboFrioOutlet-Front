export interface StoreSettings {
  storeName: string;
  freeShippingThreshold: number;
  announcementMessages: string[];
  brands: string[];
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Cabo Frio Outlet',
  freeShippingThreshold: 299,
  announcementMessages: [
    'Parcele em até 3x sem juros',
    'Troca grátis em até 30 dias',
    'Novidades toda semana',
  ],
  brands: ['Nike', 'Adidas', 'High'],
};
