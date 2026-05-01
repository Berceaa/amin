export type Product = {
  id: number;
  title: string;
  category: 'Dogs' | 'Cats' | 'Fish' | 'Small Pets' | 'Birds';
  price: string;
  description: string;
  image: string;
  tag: string;
};

export const categories = ['Dogs', 'Cats', 'Fish', 'Small Pets', 'Birds'] as const;

export const products: Product[] = [
  {
    id: 1,
    title: 'Salmon Complete Dog Food',
    category: 'Dogs',
    price: '79.99 lei',
    description: 'High-protein dry food with salmon, pumpkin, and joint support.',
    image: 'https://placehold.co/600x420/fff4ec/f27128?text=Dog+Food',
    tag: 'Best seller',
  },
  {
    id: 2,
    title: 'Feather Chase Cat Toy',
    category: 'Cats',
    price: '34.99 lei',
    description: 'Interactive teaser toy for active indoor cats.',
    image: 'https://placehold.co/600x420/fff4ec/f27128?text=Cat+Toy',
    tag: 'Indoor fun',
  },
  {
    id: 3,
    title: 'Aqua Start Kit 20L',
    category: 'Fish',
    price: '249.99 lei',
    description: 'Starter aquarium kit with filter, LED, and care guide.',
    image: 'https://placehold.co/600x420/fff4ec/f27128?text=Aquarium',
    tag: 'Starter kit',
  },
  {
    id: 4,
    title: 'Small Pet Hay Blend',
    category: 'Small Pets',
    price: '28.99 lei',
    description: 'Fresh fiber-rich blend for rabbits and guinea pigs.',
    image: 'https://placehold.co/600x420/fff4ec/f27128?text=Hay+Blend',
    tag: 'Daily care',
  },
  {
    id: 5,
    title: 'Bird Balance Seed Mix',
    category: 'Birds',
    price: '25.49 lei',
    description: 'Balanced seed mix with added minerals for small birds.',
    image: 'https://placehold.co/600x420/fff4ec/f27128?text=Bird+Food',
    tag: 'Top rated',
  },
  {
    id: 6,
    title: 'Orthopedic Pet Bed',
    category: 'Dogs',
    price: '189.99 lei',
    description: 'Soft memory foam bed for senior pets and daily comfort.',
    image: 'https://placehold.co/600x420/fff4ec/f27128?text=Pet+Bed',
    tag: 'Comfort pick',
  },
];
