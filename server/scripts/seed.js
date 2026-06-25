import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Staff from '../models/Staff.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Staff.deleteMany({});

    console.log('Cleared existing data...');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    // Create staff user
    const staff1 = await User.create({
      name: 'John Smith',
      email: 'staff@example.com',
      password: 'password123',
      role: 'staff',
    });

    // Create customer user
    const customer = await User.create({
      name: 'Jane Doe',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
    });

    console.log('Created users...');

    // Create menu items
    const menuItems = await MenuItem.insertMany([
      // Starters
      {
        name: 'Bruschetta Pomodoro',
        description: 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil',
        price: 290.,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id,
      },
      {
        name: 'Caesar Salad',
        description: 'Crispy romaine lettuce with homemade Caesar dressing, croutons, and parmesan cheese',
        price: 120,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id,
      },
      {
        name: 'Calamari Fritto',
        description: 'Crispy fried squid rings served with marinara sauce',
        price: 130,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1603133872575-9989ab68d24c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FsYW1hcmklMjBmcml0b3xlbnwwfHwwfHx8MA%3D%3D',
        isAvailable: true,
        preparationTime: 8,
        createdBy: admin._id,
      },
      {
        name: 'Caprese Salad',
        description: 'Fresh mozzarella, tomatoes, basil, balsamic vinegar and olive oil',
        price: 110,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id,
      },
      // Main Course
      {
        name: 'Egg Salmon Fillet',
        description: 'Fresh Atlantic salmon grilled with herbs, lemon, and served with seasonal vegetables',
        price: 280,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJlYWtmYXN0fGVufDB8fDB8fHww',
        isAvailable: true,
        preparationTime: 20,
        createdBy: admin._id,
      },
      {
        name: 'Filet Mignon',
        description: 'Premium beef tenderloin cooked to perfection, served with truffle mashed potatoes',
        price: 420,
        category: 'Main Course',
        image: 'https://plus.unsplash.com/premium_photo-1676106623583-e68dd66683e3?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnJlYWtmYXN0fGVufDB8fDB8fHww',
        isAvailable: true,
        preparationTime: 25,
        createdBy: admin._id,
      },
      {
        name: 'Pasta Carbonara',
        description: 'Creamy pasta with bacon, eggs, and parmesan cheese - a Roman classic',
        price: 120,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGF8ZW58MHx8MHx8fDA%3D',
        isAvailable: true,
        preparationTime: 15,
        createdBy: admin._id,
      },
      {
        name: 'Chicken Parmesan',
        description: 'Breaded chicken breast topped with marinara sauce and melted mozzarella',
        price: 340,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 18,
        createdBy: admin._id,
      },
      {
        name: 'Seafood Risotto',
        description: 'Creamy arborio rice with fresh shrimp, mussels, and scallops',
        price: 160,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 22,
        createdBy: admin._id,
      },
      {
        name: 'Lamb Chops',
        description: 'Perfectly grilled lamb chops with rosemary, garlic, and red wine reduction',
        price: 250,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1550367363-ea12860cc124?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhbWIlMjBjaG9wc3xlbnwwfHwwfHx8MA%3D%3D',
        isAvailable: true,
        preparationTime: 20,
        createdBy: admin._id,
      },
      // Desserts
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 120,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 10,
        createdBy: admin._id,
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with mascarpone, espresso, and cocoa',
        price: 80,
        category: 'Desserts',
        image: 'https://plus.unsplash.com/premium_photo-1695028378225-97fbe39df62a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGlyYW1pc3V8ZW58MHx8MHx8fDA%3D',
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id,
      },
      {
        name: 'Panna Cotta',
        description: 'Silky smooth Italian cream dessert topped with berry coulis',
        price: 80,
        category: 'Desserts',
        image: 'https://plus.unsplash.com/premium_photo-1713913281148-1098c675ff3a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFubmElMjBjb3R0YXxlbnwwfHwwfHx8MA%3D%3D',
        isAvailable: true,
        preparationTime: 8,
        createdBy: admin._id,
      },
      {
        name: 'Crème Brûlée',
        description: 'Vanilla custard with caramelized sugar crust',
        price: 45,
        category: 'Desserts',
        image: 'https://plus.unsplash.com/premium_photo-1675279010966-9bee20af667f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNyZWFtZSUyMGJydWxlfGVufDB8fDB8fHww',
        isAvailable: true,
        preparationTime: 8,
        createdBy: admin._id,
      },
      {
        name: 'Strawberry Cheesecake',
        description: 'New York style cheesecake with fresh strawberry topping',
        price: 150,
        category: 'Desserts',
        image: 'https://plus.unsplash.com/premium_photo-1722686461601-b2a018a4213b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3J0YWJlcnJ5JTIwY2hlZXpjYWtlfGVufDB8fDB8fHww',
        isAvailable: true,
        preparationTime: 10,
        createdBy: admin._id,
      },
      // Beverages
      {
        name: 'Espresso',
        description: 'Rich and bold Italian espresso coffee',
        price: 130,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1501492673258-2bcfc17241fd?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 2,
        createdBy: admin._id,
      },
      {
        name: 'Cappuccino',
        description: 'Creamy cappuccino with velvety milk foam',
        price: 100,
        category: 'Beverages',
        image: 'https://plus.unsplash.com/premium_photo-1674327105074-46dd8319164b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FwcHVjY2lub3xlbnwwfHwwfHx8MA%3D%3D',
        isAvailable: true,
        preparationTime: 3,
        createdBy: admin._id,
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 70,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 2,
        createdBy: admin._id,
      },
      {
        name: 'Iced Lemonade',
        description: 'Refreshing freshly squeezed lemonade with ice',
        price: 50,
        category: 'Beverages',
        image: 'https://media.istockphoto.com/id/2170231190/photo/refreshing-summer-coffee-drinks.webp?a=1&b=1&s=612x612&w=0&k=20&c=XUlqD4r7Ek38pDRnwB0s5plhLzc1oqyMleCz6AEWEK8=',
        isAvailable: true,
        preparationTime: 2,
        createdBy: admin._id,
      },
      {
        name: 'Red Wine - Sangiovese',
        description: 'Italian Sangiovese wine with fruity notes',
        price: 500,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1599113655947-f0a13ac23ad8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UmVkJTIwV2luZSUyMC0lMjBTYW5naW92ZXNlfGVufDB8fDB8fHww',
        isAvailable: true,
        preparationTime: 1,
        createdBy: admin._id,
      },
    ]);

    console.log('Created menu items...');

    // Create staff members
    const staffMembers = await Staff.insertMany([
      {
        name: 'John Smith',
        email: 'staff@example.com',
        phone: '5551234567',
        position: 'Chef',
        shift: 'Morning (6-2)',
        joinDate: new Date('2023-01-15'),
        salary: 50000,
        userId: staff1._id,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '5551234568',
        position: 'Waiter',
        shift: 'Afternoon (2-10)',
        joinDate: new Date('2023-02-01'),
        salary: 30000,
      },
      {
        name: 'Mike Davis',
        email: 'mike@example.com',
        phone: '5551234569',
        position: 'Kitchen Staff',
        shift: 'Night (10-6)',
        joinDate: new Date('2023-03-10'),
        salary: 28000,
      },
    ]);

    console.log('Created staff members...');
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
