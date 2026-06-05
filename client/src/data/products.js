export const allProducts = [
  // ELECTRONICS - Trending
  {
    id: '1',
    name: 'AirPods Pro Max',
    price: 550,
    salePrice: 499,
    category: 'Electronics',
    seller: 'Apple',
    tags: ['trending', 'new'],
    tag: 'BESTSELLER',
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99b99?w=800',
      'https://images.unsplash.com/photo-1625483697437-4b0d7a0e2a8e?w=800'
    ],
    description: 'Active Noise Cancellation with spatial audio. 20-hour battery life.',
    colors: [
      { name: 'Space Gray', hex: '#6B7280' },
      { name: 'Silver', hex: '#E5E7EB' },
      { name: 'Sky Blue', hex: '#60A5FA' }
    ],
    details: [
      'Active Noise Cancellation',
      'Transparency mode',
      'Spatial audio with dynamic head tracking',
      '20 hours of listening time'
    ],
    inStock: true
  },
  {
    id: '2',
    name: 'Samsung Galaxy Watch 6',
    price: 1,
    salePrice: 1,
    category: 'Electronics',
    seller: 'Samsung',
    tags: ['trending'],
    tag: 'HOT',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'
    ],
    description: 'Advanced health monitoring with sleep coaching. Wear OS powered.',
    colors: [
      { name: 'Graphite', hex: '#1F2937' },
      { name: 'Silver', hex: '#E5E7EB' }
    ],
    sizes: ['40mm', '44mm'],
    details: [
      'BioActive Sensor',
      'Sleep tracking & coaching',
      '40+ workout modes',
      'IP68 water resistant'
    ],
    inStock: true
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Headphones',
    price: 399,
    salePrice: null,
    category: 'Electronics',
    seller: 'Sony',
    tags: ['trending'],
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
    ],
    description: 'Industry-leading noise cancellation. 30-hour battery.',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Silver', hex: '#C0C0C0' }
    ],
    details: [
      'Industry-leading noise cancellation',
      '30-hour battery life',
      'Multipoint connection',
      'Speak-to-chat technology'
    ],
    inStock: true
  },
  {
    id: '4',
    name: 'iPad Pro 12.9" M2',
    price: 1,
    salePrice: 1,
    category: 'Electronics',
    seller: 'Apple',
    tags: ['new'],
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      'https://images.unsplash.com/photo-1587037549287-7e77c2c400d9?w=800'
    ],
    description: 'M2 chip. Liquid Retina XDR display. Thunderbolt port.',
    colors: [
      { name: 'Space Gray', hex: '#6B7280' },
      { name: 'Silver', hex: '#E5E7EB' }
    ],
    details: [
      'M2 chip with 8-core CPU',
      '12.9" Liquid Retina XDR display',
      'Thunderbolt / USB 4',
      'All-day battery life'
    ],
    inStock: true
  },

  // FASHION
  {
    id: '5',
    name: 'Nike Air Max 270',
    price: 160,
    salePrice: 129,
    category: 'Fashion',
    seller: 'Nike',
    tags: ['trending', 'new'],
    tag: 'NEW',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'
    ],
    description: 'Max Air unit for all-day comfort. Breathable mesh upper.',
    colors: [
      { name: 'Black/White', hex: '#000000' },
      { name: 'Triple White', hex: '#FFFFFF' },
      { name: 'University Red', hex: '#DC2626' }
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    details: [
      'Max Air 270 unit',
      'Breathable mesh upper',
      'Foam midsole',
      'Rubber outsole'
    ],
    inStock: true
  },
  {
    id: '6',
    name: 'Levi\'s 501 Original Jeans',
    price: 98,
    salePrice: null,
    category: 'Fashion',
    seller: 'Levi\'s',
    tags: [],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'
    ],
    description: 'The original blue jean since 1873. Straight fit.',
    colors: [
      { name: 'Dark Wash', hex: '#1E3A8A' },
      { name: 'Medium Wash', hex: '#3B82F6' },
      { name: 'Light Wash', hex: '#93C5FD' }
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    details: [
      '100% Cotton denim',
      'Straight leg fit',
      'Button fly',
      '5-pocket styling'
    ],
    inStock: true
  },
  {
    id: '7',
    name: 'Adidas Ultraboost 23',
    price: 1,
    salePrice: 1,
    category: 'Fashion',
    seller: 'Adidas',
    tags: ['trending'],
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800'
    ],
    description: 'Boost midsole for energy return. Primeknit upper.',
    colors: [
      { name: 'Core Black', hex: '#000000' },
      { name: 'Cloud White', hex: '#FFFFFF' }
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    details: [
      'Boost midsole',
      'Primeknit+ upper',
      'Continental™ rubber outsole',
      'Made with recycled materials'
    ],
    inStock: true
  },
  {
    id: '8',
    name: 'Ray-Ban Aviator Classic',
    price: 163,
    salePrice: null,
    category: 'Fashion',
    seller: 'Ray-Ban',
    tags: [],
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'
    ],
    description: 'Timeless aviator design. Crystal glass lenses.',
    colors: [
      { name: 'Gold/Green', hex: '#D97706' },
      { name: 'Silver/Blue', hex: '#64748B' }
    ],
    sizes: ['58mm', '62mm'],
    details: [
      'Crystal glass lenses',
      'Metal frame',
      '100% UV protection',
      'Iconic teardrop shape'
    ],
    inStock: true
  },

  // HOME
  {
    id: '9',
    name: 'Ergonomic Office Chair',
    price: 299,
    salePrice: 229,
    category: 'Home',
    seller: 'Herman Miller',
    tags: ['new'],
    tag: 'NEW',
    images: [
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
    ],
    description: 'Lumbar support with adjustable armrests. Breathable mesh back.',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Gray', hex: '#6B7280' }
    ],
    details: [
      'Adjustable lumbar support',
      'Breathable mesh back',
      '360° swivel',
      'Height adjustable'
    ],
    inStock: true
  },
  {
    id: '10',
    name: 'Ninja Professional Blender',
    price: 89,
    salePrice: 69,
    category: 'Home',
    seller: 'Ninja',
    tags: ['trending'],
    images: [
      'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800',
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800'
    ],
    description: '1000-watt motor. Crushes ice in seconds. 72oz pitcher.',
    details: [
      '1000-watt motor',
      '72oz pitcher',
      'Total crushing blades',
      'BPA-free'
    ],
    inStock: true
  },
  {
    id: '11',
    name: 'Dyson V15 Vacuum',
    price: 749,
    salePrice: 649,
    category: 'Home',
    seller: 'Dyson',
    tags: ['new'],
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
      'https://images.unsplash.com/photo-1584475785850-1c4e0df7de06?w=800'
    ],
    description: 'Laser detects microscopic dust. Up to 60 mins runtime.',
    details: [
      'Laser dust detection',
      'Up to 60 mins runtime',
      'Hyperdymium motor',
      'Whole-machine HEPA filtration'
    ],
    inStock: true
  },
  {
    id: '12',
    name: 'Weighted Blanket 15lbs',
    price: 79,
    salePrice: 59,
    category: 'Home',
    seller: 'Gravity',
    tags: [],
    images: [
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800'
    ],
    description: 'Premium glass beads. Soft minky cover. Improves sleep quality.',
    colors: [
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Navy', hex: '#1E3A8A' }
    ],
    sizes: ['15lbs', '20lbs'],
    details: [
      'Premium glass beads',
      'Removable minky cover',
      'Machine washable',
      'Even weight distribution'
    ],
    inStock: true
  },

  // SPORTS
  {
    id: '13',
    name: 'Yoga Mat Pro 6mm',
    price: 45,
    salePrice: null,
    category: 'Sports',
    seller: 'Lululemon',
    tags: [],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
    ],
    description: 'Extra thick 6mm cushion. Non-slip surface. Eco-friendly TPE.',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Purple', hex: '#7C3AED' },
      { name: 'Teal', hex: '#14B8A6' }
    ],
    details: [
      '6mm thickness',
      'Non-slip surface',
      'Eco-friendly TPE',
      'Includes carrying strap'
    ],
    inStock: true
  },
  {
    id: '14',
    name: 'Adjustable Dumbbells 50lb',
    price: 299,
    salePrice: 249,
    category: 'Sports',
    seller: 'Bowflex',
    tags: ['trending'],
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'
    ],
    description: 'Adjust from 5-50lbs. Replaces 15 sets of weights.',
    details: [
      'Adjustable 5-50lbs',
      'Space saving design',
      'Durable molding',
      'Easy weight selection'
    ],
    inStock: true
  },

  // BEAUTY
  {
    id: '15',
    name: 'Vitamin C Serum',
    price: 28,
    salePrice: null,
    category: 'Beauty',
    seller: 'The Ordinary',
    tags: ['new'],
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'
    ],
    description: 'Brightens skin tone. Reduces fine lines. 30ml.',
    details: [
      '23% L-Ascorbic Acid',
      'Brightens skin',
      'Reduces signs of aging',
      '30ml bottle'
    ],
    inStock: true
  },
  {
    id: '16',
    name: 'Dyson Airwrap',
    price: 599,
    salePrice: 549,
    category: 'Beauty',
    seller: 'Dyson',
    tags: ['trending'],
    tag: 'BESTSELLER',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'
    ],
    description: 'Style without extreme heat. Multiple attachments included.',
    details: [
      'Coanda air styling',
      'No extreme heat',
      'Multiple attachments',
      'Intelligent heat control'
    ],
    inStock: true
  }
];

export const categories = ['All', 'New In', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Sale'];