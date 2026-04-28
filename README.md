# RestauroHub - Restaurant Management System

A full-stack restaurant management web application built with MERN (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Features

### Authentication & Authorization
- User roles: Admin (restaurant owner), Staff, and Customer
- Secure JWT-based authentication
- Role-based access control

### Dashboard
- Admin analytics with daily sales, reservations, and top dishes
- Staff dashboard for order management
- Customer dashboard for order and reservation history

### Menu Management
- Add, edit, delete menu items
- Categorization (Starters, Main Course, Desserts, Drinks)
- Image support for menu items

### Reservations
- Customers can book tables with date/time and party size
- Admin/staff can approve or decline reservations
- Calendar view for reservations

### Order Management
- Customers can place online orders
- Order status tracking (Pending, Preparing, Ready, Delivered)
- Multiple delivery types (Dine-in, Takeaway, Delivery)

### Staff Management
- Add and edit staff details
- Assign roles and shifts
- Track staff performance

### UI/UX
- Responsive design with Tailwind CSS
- Dark/Light mode toggle
- Modern and clean interface

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Recharts for analytics
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcryptjs for password hashing
- CORS for cross-origin requests

### Database
- MongoDB (local or MongoDB Atlas)

## Project Structure

```
restaurohub/
├── MAJORPROJECT/          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── common/    # Reusable components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   ├── menu/      # Menu components
│   │   │   ├── orders/    # Orders components
│   │   │   ├── reservations/ # Reservation components
│   │   │   └── staff/     # Staff components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom hooks
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                # Backend (Express)
    ├── controllers/       # Route handlers
    ├── models/            # MongoDB schemas
    ├── routes/            # API routes
    ├── middleware/        # Custom middleware
    ├── config/            # Configuration
    ├── utils/             # Utility functions
    ├── scripts/           # Database seeds
    ├── server.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd MAJORPROJECT
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

Frontend will be running on `http://localhost:5173`

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurohub
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

5. Seed the database with sample data (optional):
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

Backend will be running on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Menu Items
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `GET /api/menu/category/:category` - Get items by category
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Orders
- `GET /api/orders` - Get all orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `POST /api/orders` - Create order (Protected)
- `PUT /api/orders/:id` - Update order (Protected)
- `PUT /api/orders/:id/status` - Update order status (Admin/Staff)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Reservations
- `GET /api/reservations` - Get all reservations (Protected)
- `GET /api/reservations/:id` - Get single reservation (Protected)
- `POST /api/reservations` - Create reservation (Protected)
- `PUT /api/reservations/:id` - Update reservation (Protected)
- `PUT /api/reservations/:id/status` - Update status (Admin/Staff)
- `DELETE /api/reservations/:id` - Delete reservation (Protected)

### Staff
- `GET /api/staff` - Get all staff (Admin)
- `GET /api/staff/:id` - Get single staff (Admin)
- `POST /api/staff` - Create staff (Admin)
- `PUT /api/staff/:id` - Update staff (Admin)
- `DELETE /api/staff/:id` - Delete staff (Admin)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (Admin)
- `GET /api/dashboard/sales` - Get sales data (Admin)
- `GET /api/dashboard/reservations` - Get reservation stats (Admin)
- `GET /api/dashboard/top-dishes` - Get top dishes (Admin)

## Demo Credentials

### Admin
- Email: `admin@example.com`
- Password: `password123`

### Staff
- Email: `staff@example.com`
- Password: `password123`

### Customer
- Email: `customer@example.com`
- Password: `password123`

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Email/SMS notifications
- Customer reviews and ratings
- Inventory management
- Table management system
- Advanced reporting and analytics
- Multi-restaurant support
- Mobile app version
- Real-time order tracking

## License

This project is licensed under the ISC License.

## Support

For issues and feature requests, please create an issue in the repository.
