export interface BathStep {
  key: string;
  title: string;
  hint: string;
  tool: string; // emoji placeholder
  cloud: string; // emoji shown around the cat
  cloudGrows: boolean; // true: cloud grows with progress, false: it fades away
}

export const BATH_STEPS: BathStep[] = [
  { key: 'shampoo', title: 'Shampoo', hint: 'Drag the shampoo to your cat and rub!', tool: '🧴', cloud: '🫧', cloudGrows: true },
  { key: 'shower', title: 'Shower', hint: 'Drag the shower over your cat to rinse', tool: '🚿', cloud: '🫧', cloudGrows: false },
  { key: 'towel', title: 'Towel', hint: 'Rub with the towel to dry', tool: '🧻', cloud: '💧', cloudGrows: false },
];
