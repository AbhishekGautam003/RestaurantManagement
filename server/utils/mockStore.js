const now = Date.now();

const mockStaff = [
  {
    _id: 'mock-staff-record-1',
    name: 'John Smith',
    email: 'staff@example.com',
    phone: '5551234567',
    position: 'Chef',
    shift: 'Morning (6-2)',
    joinDate: '2023-01-15T00:00:00.000Z',
    salary: 50000,
    isActive: true,
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-01-15T00:00:00.000Z',
  },
  {
    _id: 'mock-staff-record-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '5551234568',
    position: 'Waiter',
    shift: 'Afternoon (2-10)',
    joinDate: '2023-02-01T00:00:00.000Z',
    salary: 30000,
    isActive: true,
    createdAt: '2023-02-01T00:00:00.000Z',
    updatedAt: '2023-02-01T00:00:00.000Z',
  },
];

const mockReservations = [
  {
    _id: 'mock-reservation-1',
    customerId: 'mock-customer',
    customerName: 'Jane Doe',
    customerEmail: 'customer@example.com',
    customerPhone: '5551002000',
    partySize: 4,
    reservationDate: '2026-05-01T00:00:00.000Z',
    reservationTime: '19:00',
    status: 'Pending',
    notes: 'Window seat if available',
    createdAt: new Date(now - 86400000).toISOString(),
    updatedAt: new Date(now - 86400000).toISOString(),
  },
  {
    _id: 'mock-reservation-2',
    customerId: 'mock-customer',
    customerName: 'Jane Doe',
    customerEmail: 'customer@example.com',
    customerPhone: '5551002000',
    partySize: 2,
    reservationDate: '2026-05-03T00:00:00.000Z',
    reservationTime: '20:30',
    status: 'Approved',
    notes: '',
    createdAt: new Date(now - 43200000).toISOString(),
    updatedAt: new Date(now - 21600000).toISOString(),
  },
];

const mockOrders = [
  {
    _id: 'mock-order-1',
    customerId: 'mock-customer',
    customerName: 'Jane Doe',
    items: [
      {
        name: 'Pasta Carbonara',
        quantity: 2,
        price: 18.99,
        subtotal: 37.98,
      },
    ],
    totalAmount: 37.98,
    status: 'Preparing',
    deliveryType: 'Dine-in',
    paymentStatus: 'Completed',
    paymentMethod: 'Card',
    notes: '',
    createdAt: new Date(now - 7200000).toISOString(),
    updatedAt: new Date(now - 3600000).toISOString(),
  },
  {
    _id: 'mock-order-2',
    customerId: 'mock-customer',
    customerName: 'Jane Doe',
    items: [
      {
        name: 'Tiramisu',
        quantity: 1,
        price: 9.99,
        subtotal: 9.99,
      },
    ],
    totalAmount: 9.99,
    status: 'Delivered',
    deliveryType: 'Takeaway',
    paymentStatus: 'Completed',
    paymentMethod: 'Cash',
    notes: '',
    createdAt: new Date(now - 172800000).toISOString(),
    updatedAt: new Date(now - 169200000).toISOString(),
  },
];

const mockMenuItems = [
  {
    _id: 'mock-menu-1',
    name: 'Paneer Tikka Skewers',
    description: 'Char-grilled cottage cheese cubes with peppers, onion, and mint chutney',
    price: 249,
    category: 'Starters',
    dietaryType: 'veg',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    isAvailable: true,
    preparationTime: 5,
  },
  {
    _id: 'mock-menu-2',
    name: 'Dahi Ke Kebab',
    description: 'Crisp yogurt kebabs with herbs, mild spice, and a soft creamy center',
    price: 219,
    category: 'Starters',
    dietaryType: 'veg',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    isAvailable: true,
    preparationTime: 5,
  },
  {
    _id: 'mock-menu-3',
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice with vegetables, saffron, and slow-cooked spices',
    price: 329,
    category: 'Main Course',
    dietaryType: 'veg',
    image: 'https://images.unsplash.com/photo-1612874742237-415221591ee3?w=400&h=300&fit=crop',
    isAvailable: true,
    preparationTime: 15,
  },
  {
    _id: 'mock-menu-4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 189,
    category: 'Desserts',
    dietaryType: 'veg',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    isAvailable: true,
    preparationTime: 10,
  },
  {
    _id: 'mock-menu-5',
    name: 'Fresh Lime Soda',
    description: 'Fresh lime, soda, and mint served chilled',
    price: 99,
    category: 'Beverages',
    dietaryType: 'veg',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
    isAvailable: true,
    preparationTime: 2,
  },
  {
    _id: 'mock-menu-6',
    name: 'Chicken Tikka',
    description: 'Smoky grilled chicken tikka with onion rings and mint chutney',
    price: 289,
    category: 'Starters',
    dietaryType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    isAvailable: true,
    preparationTime: 18,
  },
  {
    _id: 'mock-menu-7',
    name: 'Butter Chicken',
    description: 'Creamy tomato butter gravy with tender chicken pieces and herbs',
    price: 379,
    category: 'Main Course',
    dietaryType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
    isAvailable: true,
    preparationTime: 22,
  },
  {
    _id: 'mock-menu-8',
    name: 'Mutton Biryani',
    description: 'Slow-cooked basmati rice layered with spiced mutton and saffron',
    price: 429,
    category: 'Main Course',
    dietaryType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=400&h=300&fit=crop',
    isAvailable: true,
    preparationTime: 28,
  },
  {
    _id: 'mock-menu-9',
    name: 'Prawn Curry',
    description: 'Coastal style prawn curry with coconut, curry leaves, and spices',
    price: 399,
    category: 'Main Course',
    dietaryType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1626500155537-93690c24099e?w=400&h=300&fit=crop',
    isAvailable: true,
    preparationTime: 24,
  },
];

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isMockUser(user) {
  return Boolean(user?.id?.startsWith('mock-') || user?._id?.startsWith?.('mock-'));
}

export function getUserIdentifier(user) {
  return user?._id || user?.id || null;
}

export function getMockOrders(user) {
  if (user?.role === 'customer') {
    const userId = getUserIdentifier(user);
    return mockOrders.filter((order) => order.customerId === userId);
  }
  return mockOrders;
}

export function createMockOrder(payload, user) {
  const timestamp = new Date().toISOString();
  const order = {
    _id: createId('mock-order'),
    customerId: getUserIdentifier(user),
    customerName: user?.name || payload.customerName || 'Walk-in Customer',
    items: payload.items || [],
    totalAmount: payload.totalAmount || 0,
    status: payload.status || 'Pending',
    deliveryType: payload.deliveryType || 'Dine-in',
    deliveryAddress: payload.deliveryAddress || '',
    paymentStatus: payload.paymentStatus || 'Pending',
    paymentMethod: payload.paymentMethod || 'Cash',
    notes: payload.notes || '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  mockOrders.unshift(order);
  return order;
}

export function updateMockOrder(id, updates) {
  const index = mockOrders.findIndex((order) => order._id === id);
  if (index === -1) return null;
  mockOrders[index] = {
    ...mockOrders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockOrders[index];
}

export function deleteMockOrder(id) {
  const index = mockOrders.findIndex((order) => order._id === id);
  if (index === -1) return false;
  mockOrders.splice(index, 1);
  return true;
}

export function getMockOrderById(id) {
  return mockOrders.find((order) => order._id === id) || null;
}

export function getMockReservations(user) {
  if (user?.role === 'customer') {
    const userId = getUserIdentifier(user);
    return mockReservations.filter((reservation) => reservation.customerId === userId);
  }
  return mockReservations;
}

export function createMockReservation(payload, user) {
  const timestamp = new Date().toISOString();
  const reservation = {
    _id: createId('mock-reservation'),
    customerId: getUserIdentifier(user),
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    partySize: Number(payload.partySize),
    reservationDate: new Date(payload.reservationDate).toISOString(),
    reservationTime: payload.reservationTime,
    status: payload.status || 'Pending',
    notes: payload.notes || '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  mockReservations.unshift(reservation);
  return reservation;
}

export function updateMockReservation(id, updates) {
  const index = mockReservations.findIndex((reservation) => reservation._id === id);
  if (index === -1) return null;
  mockReservations[index] = {
    ...mockReservations[index],
    ...updates,
    partySize: updates.partySize ? Number(updates.partySize) : mockReservations[index].partySize,
    reservationDate: updates.reservationDate
      ? new Date(updates.reservationDate).toISOString()
      : mockReservations[index].reservationDate,
    updatedAt: new Date().toISOString(),
  };
  return mockReservations[index];
}

export function deleteMockReservation(id) {
  const index = mockReservations.findIndex((reservation) => reservation._id === id);
  if (index === -1) return false;
  mockReservations.splice(index, 1);
  return true;
}

export function getMockReservationById(id) {
  return mockReservations.find((reservation) => reservation._id === id) || null;
}

export function getMockStaff() {
  return mockStaff;
}

export function createMockStaff(payload) {
  const timestamp = new Date().toISOString();
  const staffMember = {
    _id: createId('mock-staff-record'),
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    position: payload.position,
    shift: payload.shift,
    joinDate: new Date(payload.joinDate).toISOString(),
    salary: payload.salary ? Number(payload.salary) : 0,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  mockStaff.unshift(staffMember);
  return staffMember;
}

export function updateMockStaff(id, updates) {
  const index = mockStaff.findIndex((staffMember) => staffMember._id === id);
  if (index === -1) return null;
  mockStaff[index] = {
    ...mockStaff[index],
    ...updates,
    joinDate: updates.joinDate
      ? new Date(updates.joinDate).toISOString()
      : mockStaff[index].joinDate,
    salary: updates.salary !== undefined ? Number(updates.salary) : mockStaff[index].salary,
    updatedAt: new Date().toISOString(),
  };
  return mockStaff[index];
}

export function deleteMockStaff(id) {
  const index = mockStaff.findIndex((staffMember) => staffMember._id === id);
  if (index === -1) return false;
  mockStaff.splice(index, 1);
  return true;
}

export function getMockStaffById(id) {
  return mockStaff.find((staffMember) => staffMember._id === id) || null;
}

export function getMockMenuItems() {
  return mockMenuItems;
}

export function getMockMenuItemById(id) {
  return mockMenuItems.find((item) => item._id === id) || null;
}

export function createMockMenuItem(payload) {
  const item = {
    _id: createId('mock-menu'),
    name: payload.name,
    description: payload.description || '',
    price: Number(payload.price || 0),
    category: payload.category || 'Main Course',
    dietaryType: payload.dietaryType || 'veg',
    image: payload.image || '',
    isAvailable: payload.isAvailable ?? true,
    preparationTime: Number(payload.preparationTime || 15),
  };
  mockMenuItems.unshift(item);
  return item;
}

export function updateMockMenuItem(id, updates) {
  const index = mockMenuItems.findIndex((item) => item._id === id);
  if (index === -1) return null;
  mockMenuItems[index] = {
    ...mockMenuItems[index],
    ...updates,
    price: updates.price !== undefined ? Number(updates.price) : mockMenuItems[index].price,
    preparationTime:
      updates.preparationTime !== undefined
        ? Number(updates.preparationTime)
        : mockMenuItems[index].preparationTime,
    dietaryType: updates.dietaryType || mockMenuItems[index].dietaryType,
  };
  return mockMenuItems[index];
}

export function deleteMockMenuItem(id) {
  const index = mockMenuItems.findIndex((item) => item._id === id);
  if (index === -1) return false;
  mockMenuItems.splice(index, 1);
  return true;
}

export function getMockDashboardStats() {
  const totalOrders = mockOrders.length;
  const totalReservations = mockReservations.length;
  const totalCustomers = 1;
  const totalSales = mockOrders
    .filter((order) => order.paymentStatus === 'Completed')
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const ordersByStatusMap = new Map();
  for (const order of mockOrders) {
    ordersByStatusMap.set(order.status, (ordersByStatusMap.get(order.status) || 0) + 1);
  }

  const dishMap = new Map();
  for (const order of mockOrders) {
    for (const item of order.items || []) {
      const key = item.name || 'Unknown Item';
      const current = dishMap.get(key) || { name: key, orders: 0, revenue: 0 };
      current.orders += Number(item.quantity || 0);
      current.revenue += Number(item.subtotal || 0);
      dishMap.set(key, current);
    }
  }

  return {
    totalOrders,
    totalReservations,
    totalCustomers,
    totalSales,
    ordersByStatus: [...ordersByStatusMap.entries()].map(([status, count]) => ({ status, count })),
    topDishes: [...dishMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
  };
}

export function getMockSalesData() {
  const grouped = new Map();

  for (const order of mockOrders) {
    if (order.paymentStatus !== 'Completed') continue;
    const date = new Date(order.createdAt).toISOString().slice(0, 10);
    const current = grouped.get(date) || { date, sales: 0, orders: 0 };
    current.sales += Number(order.totalAmount || 0);
    current.orders += 1;
    grouped.set(date, current);
  }

  return [...grouped.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function getMockReservationStats() {
  const byStatusMap = new Map();
  for (const reservation of mockReservations) {
    byStatusMap.set(reservation.status, (byStatusMap.get(reservation.status) || 0) + 1);
  }

  return {
    byStatus: [...byStatusMap.entries()].map(([_id, count]) => ({ _id, count })),
    upcoming: [...mockReservations]
      .sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate))
      .slice(0, 5),
  };
}
