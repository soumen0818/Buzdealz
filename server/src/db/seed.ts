import { db } from './index';
import { users, deals } from './schema';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Create test users
    console.log('Creating test users...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);

    const testUsers = await db
      .insert(users)
      .values([
        {
          email: 'user@example.com',
          name: 'Test User',
          password: hashedPassword,
          isSubscriber: false,
        },
        {
          email: 'subscriber@example.com',
          name: 'Premium Subscriber',
          password: hashedPassword,
          isSubscriber: true,
        },
        {
          email: 'demo@buzdealz.com',
          name: 'Demo User',
          password: hashedPassword,
          isSubscriber: false,
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`✅ Created ${testUsers.length} users`);
    console.log('   📧 user@example.com (password: password123) - Regular user');
    console.log('   📧 subscriber@example.com (password: password123) - Subscriber');
    console.log('   📧 demo@buzdealz.com (password: password123) - Demo user\n');

    // Create sample deals
    console.log('Creating sample deals...');

    const sampleDeals = await db
      .insert(deals)
      .values([
        {
          title: 'Premium Wireless Headphones - Noise Cancelling',
          description: 'Experience crystal-clear audio with active noise cancellation and 30-hour battery life. Perfect for travel, work, or leisure.',
          price: '89.99',
          originalPrice: '199.99',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
          category: 'Electronics',
          merchant: 'TechStore',
          link: 'https://example.com/deal/headphones',
          isActive: true,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        {
          title: 'Smart Watch Series 5 - Fitness Tracker',
          description: 'Track your health and fitness goals with advanced sensors, GPS, and heart rate monitoring. Water-resistant up to 50m.',
          price: '149.99',
          originalPrice: '299.99',
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
          category: 'Wearables',
          merchant: 'GadgetHub',
          link: 'https://example.com/deal/smartwatch',
          isActive: true,
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        },
        {
          title: 'Designer Leather Backpack - Premium Quality',
          description: 'Spacious and stylish backpack perfect for work or travel. Made with genuine leather and premium materials.',
          price: '79.99',
          originalPrice: '149.99',
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
          category: 'Fashion',
          merchant: 'StyleStore',
          link: 'https://example.com/deal/backpack',
          isActive: true,
          expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
        },
        {
          title: '4K Ultra HD Action Camera',
          description: 'Capture every adventure in stunning 4K resolution with waterproof design. Includes mounting accessories.',
          price: '199.99',
          originalPrice: '399.99',
          imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
          category: 'Electronics',
          merchant: 'CameraPro',
          link: 'https://example.com/deal/camera',
          isActive: true,
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        },
        {
          title: 'Portable Bluetooth Speaker - Waterproof',
          description: '360° sound with deep bass and 24-hour battery life. IPX7 waterproof rating for outdoor use.',
          price: '49.99',
          originalPrice: '99.99',
          imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop',
          category: 'Audio',
          merchant: 'SoundWave',
          link: 'https://example.com/deal/speaker',
          isActive: true,
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
        {
          title: 'Premium Yoga Mat with Carry Bag',
          description: 'Extra thick, non-slip yoga mat perfect for all types of exercises. Includes carrying strap and bag.',
          price: '29.99',
          originalPrice: '59.99',
          imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=600&fit=crop',
          category: 'Fitness',
          merchant: 'FitLife',
          link: 'https://example.com/deal/yoga-mat',
          isActive: true,
          expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
        },
        {
          title: 'Mechanical Gaming Keyboard - RGB Backlit',
          description: 'Professional gaming keyboard with mechanical switches and customizable RGB lighting. Built for gamers.',
          price: '79.99',
          originalPrice: '149.99',
          imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop',
          category: 'Gaming',
          merchant: 'GamersWorld',
          link: 'https://example.com/deal/keyboard',
          isActive: true,
          expiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days
        },
        {
          title: 'Instant Pot Multi-Cooker - 6 Quart',
          description: '7-in-1 programmable pressure cooker. Slow cooker, rice cooker, steamer, and more. Stainless steel.',
          price: '69.99',
          originalPrice: '119.99',
          imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop',
          category: 'Home',
          merchant: 'KitchenPro',
          link: 'https://example.com/deal/instant-pot',
          isActive: true,
          expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days
        },
        {
          title: 'EXPIRED: Vintage Sunglasses',
          description: 'Classic style sunglasses - this deal has expired',
          price: '19.99',
          originalPrice: '49.99',
          imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
          category: 'Fashion',
          merchant: 'FashionHub',
          link: 'https://example.com/deal/sunglasses',
          isActive: true,
          expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Expired 2 days ago
        },
        {
          title: 'DISABLED: Old Phone Case',
          description: 'This product is no longer available',
          price: '9.99',
          originalPrice: '29.99',
          imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=600&fit=crop',
          category: 'Accessories',
          merchant: 'MobileMart',
          link: 'https://example.com/deal/phone-case',
          isActive: false, // Disabled deal
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`✅ Created ${sampleDeals.length} deals`);
    console.log('   Including 8 active deals, 1 expired deal, and 1 disabled deal\n');

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📝 You can now:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Login with: user@example.com / password123');
    console.log('   3. Or use subscriber: subscriber@example.com / password123');
    console.log('   4. View deals at: http://localhost:3000/api/deals\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
