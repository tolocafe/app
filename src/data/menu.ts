export interface MenuItem {
  id: string
  name: string
  description: string
  category: 'coffee' | 'tea' | 'pastries' | 'sandwiches' | 'seasonal'
  price: number
  image?: string
  isPopular?: boolean
  isNew?: boolean
}

export const menuItems: MenuItem[] = [
  // Coffee
  {
    id: '1',
    name: 'Espresso',
    description: 'Rich and bold single shot',
    category: 'coffee',
    price: 2.5,
    isPopular: true,
  },
  {
    id: '2',
    name: 'Americano',
    description: 'Espresso with hot water',
    category: 'coffee',
    price: 3.0,
  },
  {
    id: '3',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    category: 'coffee',
    price: 4.0,
    isPopular: true,
  },
  {
    id: '4',
    name: 'Latte',
    description: 'Espresso with steamed milk',
    category: 'coffee',
    price: 4.5,
    isPopular: true,
  },
  {
    id: '5',
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    category: 'coffee',
    price: 5.0,
  },
  {
    id: '6',
    name: 'Cold Brew',
    description: 'Smooth, cold-steeped coffee',
    category: 'coffee',
    price: 3.5,
    isNew: true,
  },

  // Tea
  {
    id: '7',
    name: 'Green Tea',
    description: 'Japanese sencha green tea',
    category: 'tea',
    price: 2.5,
  },
  {
    id: '8',
    name: 'Earl Grey',
    description: 'Black tea with bergamot',
    category: 'tea',
    price: 2.5,
  },
  {
    id: '9',
    name: 'Chai Latte',
    description: 'Spiced tea with steamed milk',
    category: 'tea',
    price: 4.0,
  },

  // Pastries
  {
    id: '10',
    name: 'Croissant',
    description: 'Buttery, flaky French pastry',
    category: 'pastries',
    price: 3.5,
    isPopular: true,
  },
  {
    id: '11',
    name: 'Blueberry Muffin',
    description: 'Fresh baked with real blueberries',
    category: 'pastries',
    price: 3.0,
  },
  {
    id: '12',
    name: 'Chocolate Chip Cookie',
    description: 'Warm and gooey',
    category: 'pastries',
    price: 2.5,
  },

  // Sandwiches
  {
    id: '13',
    name: 'Avocado Toast',
    description: 'Smashed avocado on artisan bread',
    category: 'sandwiches',
    price: 8.0,
    isNew: true,
  },
  {
    id: '14',
    name: 'BLT Sandwich',
    description: 'Bacon, lettuce, tomato on sourdough',
    category: 'sandwiches',
    price: 9.0,
  },

  // Seasonal
  {
    id: '15',
    name: 'Pumpkin Spice Latte',
    description: 'Fall favorite with pumpkin and spices',
    category: 'seasonal',
    price: 5.5,
    isNew: true,
  },
]

export const categories = [
  { id: 'coffee', name: 'Coffee' },
  { id: 'tea', name: 'Tea' },
  { id: 'pastries', name: 'Pastries' },
  { id: 'sandwiches', name: 'Sandwiches' },
  { id: 'seasonal', name: 'Seasonal' },
]
