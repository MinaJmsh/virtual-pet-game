import { EquipSlot, ItemCategory } from '@/game/types';

export interface ShopItem {
  id: string;
  name: string;
  icon: string; // emoji placeholder; swap for require('...png') later
  category: ItemCategory;
  price: number;
  slot?: EquipSlot; // only outfits can be worn
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'bow', name: 'Pink Bow', icon: '🎀', category: 'outfits', price: 25, slot: 'head' },
  { id: 'top_hat', name: 'Top Hat', icon: '🎩', category: 'outfits', price: 40, slot: 'head' },
  { id: 'crown', name: 'Little Crown', icon: '👑', category: 'outfits', price: 100, slot: 'head' },
  { id: 'bell', name: 'Bell Collar', icon: '🔔', category: 'outfits', price: 25, slot: 'neck' },
  { id: 'scarf', name: 'Cozy Scarf', icon: '🧣', category: 'outfits', price: 45, slot: 'neck' },
  { id: 'bed', name: 'Soft Bed', icon: '🛏️', category: 'furniture', price: 60 },
  { id: 'bookshelf', name: 'Bookshelf', icon: '📚', category: 'furniture', price: 60 },
  { id: 'sofa', name: 'Sofa', icon: '🛋️', category: 'furniture', price: 80 },
  { id: 'plant', name: 'Plant', icon: '🪴', category: 'decor', price: 35 },
  { id: 'lamp', name: 'Lamp', icon: '💡', category: 'decor', price: 35 },
  { id: 'yarn', name: 'Yarn Ball', icon: '🧶', category: 'decor', price: 35 },
];

export const getItem = (id: string | null | undefined) => SHOP_ITEMS.find((i) => i.id === id);
