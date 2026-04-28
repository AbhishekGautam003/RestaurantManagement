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
        name: 'Bruschetta Al Pomodoro',
        description: 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil',
        price: 9.99,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id,
      },
      {
        name: 'Caesar Salad',
        description: 'Crispy romaine lettuce with homemade Caesar dressing, croutons, and parmesan cheese',
        price: 12.99,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id,
      },
      {
        name: 'Calamari Fritto',
        description: 'Crispy fried squid rings served with marinara sauce',
        price: 13.99,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1599599810694-b3b2a42e5c77?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 8,
        createdBy: admin._id,
      },
      {
        name: 'Caprese Salad',
        description: 'Fresh mozzarella, tomatoes, basil, balsamic vinegar and olive oil',
        price: 11.99,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id,
      },
      // Main Course
      {
        name: 'Grilled Salmon Fillet',
        description: 'Fresh Atlantic salmon grilled with herbs, lemon, and served with seasonal vegetables',
        price: 28.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 20,
        createdBy: admin._id,
      },
      {
        name: 'Filet Mignon',
        description: 'Premium beef tenderloin cooked to perfection, served with truffle mashed potatoes',
        price: 42.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1586190441893-c171a688d090?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 25,
        createdBy: admin._id,
      },
      {
        name: 'Pasta Carbonara',
        description: 'Creamy pasta with bacon, eggs, and parmesan cheese - a Roman classic',
        price: 18.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1612874742237-415221591ee3?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 15,
        createdBy: admin._id,
      },
      {
        name: 'Chicken Parmesan',
        description: 'Breaded chicken breast topped with marinara sauce and melted mozzarella',
        price: 19.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 18,
        createdBy: admin._id,
      },
      {
        name: 'Seafood Risotto',
        description: 'Creamy arborio rice with fresh shrimp, mussels, and scallops',
        price: 26.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 22,
        createdBy: admin._id,
      },
      {
        name: 'Lamb Chops',
        description: 'Perfectly grilled lamb chops with rosemary, garlic, and red wine reduction',
        price: 34.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1586985289688-cacf10b6c419?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 20,
        createdBy: admin._id,
      },
      // Desserts
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 10.99,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 10,
        createdBy: admin._id,
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with mascarpone, espresso, and cocoa',
        price: 9.99,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1571115764595-644807dd5f64?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id,
      },
      {
        name: 'Panna Cotta',
        description: 'Silky smooth Italian cream dessert topped with berry coulis',
        price: 8.99,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1488477181946-6b0b327ef146?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 8,
        createdBy: admin._id,
      },
      {
        name: 'Crème Brûlée',
        description: 'Vanilla custard with caramelized sugar crust',
        price: 9.99,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1470124716159-e389f8712fda?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 8,
        createdBy: admin._id,
      },
      {
        name: 'Strawberry Cheesecake',
        description: 'New York style cheesecake with fresh strawberry topping',
        price: 10.99,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1533134242443-742c55928019?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 10,
        createdBy: admin._id,
      },
      // Beverages
      {
        name: 'Espresso',
        description: 'Rich and bold Italian espresso coffee',
        price: 3.99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1501492673258-2bcfc17241fd?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 2,
        createdBy: admin._id,
      },
      {
        name: 'Cappuccino',
        description: 'Creamy cappuccino with velvety milk foam',
        price: 4.99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 3,
        createdBy: admin._id,
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 5.99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 2,
        createdBy: admin._id,
      },
      {
        name: 'Iced Lemonade',
        description: 'Refreshing freshly squeezed lemonade with ice',
        price: 4.99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1585518419759-74d440642117?w=400&h=300&fit=crop',
        isAvailable: true,
        preparationTime: 2,
        createdBy: admin._id,
      },
      {
        name: 'Red Wine - Sangiovese',
        description: 'Italian Sangiovese wine with fruity notes',
        price: 8.99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2cab2ce25?w=400&h=300&fit=crop',
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
