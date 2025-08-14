
export const filterCategories = [
    { 
      name: 'Men',
      href: '/men',
      description: 'Find the latest trends for men.',
      subCategories: [
        {
          group: 'Topwear',
          items: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts', 'Jackets']
        },
        {
          group: 'Bottomwear',
          items: ['Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Track Pants']
        },
        {
          group: 'Footwear',
          items: ['Casual Shoes', 'Sports Shoes', 'Formal Shoes', 'Sneakers', 'Sandals']
        },
        {
          group: 'Accessories',
          items: ['Watches', 'Wallets', 'Belts', 'Sunglasses', 'Bags']
        }
      ]
    },
    { 
      name: 'Women', 
      href: '/women',
      description: 'Shop stylish apparel for women.', 
      subCategories: [
        {
          group: 'Indian & Fusion Wear',
          items: ['Kurtas & Suits', 'Sarees', 'Lehengas', 'Ethnic Gowns']
        },
        {
          group: 'Western Wear',
          items: ['Dresses', 'Tops', 'T-Shirts', 'Jeans', 'Skirts']
        },
        {
          group: 'Footwear',
          items: ['Flats', 'Heels', 'Boots', 'Sports Shoes']
        },
        {
          group: 'Jewellery & Accessories',
          items: ['Earrings', 'Necklaces', 'Handbags', 'Watches']
        }
      ]
    },
    { 
      name: 'Kids',
      href: '/kids', 
      description: 'Adorable outfits for the little ones.', 
      subCategories: [
         {
          group: 'Boys Clothing',
          items: ['T-Shirts', 'Shirts', 'Jeans', 'Shorts']
        },
        {
          group: 'Girls Clothing',
          items: ['Dresses', 'Tops', 'Skirts', 'T-shirts']
        },
        {
          group: 'Infants',
          items: ['Rompers', 'Bodysuits', 'Sleepwear']
        },
        {
          group: 'Toys & Games',
          items: ['Action Figures', 'Dolls', 'Board Games', 'Puzzles']
        }
      ] 
    },
    { 
      name: 'Home & Living', 
      href: '/home-living',
      description: 'Decorate your space with style.', 
      subCategories: [
        {
          group: 'Bed & Bath',
          items: ['Bedsheets', 'Pillows', 'Towels', 'Bathrobes']
        },
        {
          group: 'Decor',
          items: ['Vases', 'Photo Frames', 'Wall Art', 'Candles']
        },
        {
          group: 'Kitchen & Dining',
          items: ['Dinnerware', 'Cookware', 'Storage', 'Cutlery']
        }
      ] 
    },
    { 
      name: 'Beauty', 
      href: '/beauty',
      description: 'Discover your new favorite products.', 
      subCategories: [
        {
          group: 'Makeup',
          items: ['Lipstick', 'Foundation', 'Mascara', 'Eyeshadow']
        },
        {
          group: 'Skincare',
          items: ['Moisturizer', 'Cleanser', 'Sunscreen', 'Face Masks']
        },
        {
          group: 'Fragrance',
          items: ['Perfumes', 'Deodorants', 'Body Mists']
        },
        {
          group: 'Haircare',
          items: ['Shampoo', 'Conditioner', 'Hair Oil', 'Styling Tools']
        }
      ] 
    },
    {
      name: 'Electronics',
      href: '/electronics',
      description: 'Get the latest gadgets.',
      subCategories: [
        {
          group: 'Mobiles & Wearables',
          items: ['Smartphones', 'Smartwatches', 'Headphones', 'Speakers'],
        },
        {
          group: 'Laptops & Computers',
          items: ['Laptops', 'Desktops', 'Monitors', 'Keyboards', 'Mouse'],
        },
        {
          group: 'Cameras & Drones',
          items: ['DSLRs', 'Mirrorless Cameras', 'Drones', 'Action Cameras'],
        },
      ],
    },
    {
      name: 'Sports',
      href: '/sports',
      description: 'Gear up for your favorite sports.',
      subCategories: [
        {
          group: 'Cricket',
          items: ['Bats', 'Balls', 'Pads', 'Gloves'],
        },
        {
          group: 'Football',
          items: ['Footballs', 'Jerseys', 'Boots', 'Shin Guards'],
        },
        {
          group: 'Fitness',
          items: ['Dumbbells', 'Yoga Mats', 'Resistance Bands', 'Trackers'],
        },
      ],
    },
    {
      name: 'Books',
      href: '/books',
      description: 'Explore a world of stories.',
      subCategories: [
        {
          group: 'Fiction',
          items: ['Mystery', 'Thriller', 'Sci-Fi', 'Fantasy', 'Romance'],
        },
        {
          group: 'Non-Fiction',
          items: ['Biography', 'History', 'Self-Help', 'Business'],
        },
        {
          group: "Children's Books",
          items: ['Picture Books', 'Story Books', 'Young Adult'],
        },
      ],
    },
];
