# Quick Start Guide - RestauroHub

## 🚀 Getting Started

### Prerequisites
- Node.js v14+ 
- npm or yarn
- MongoDB (local or MongoDB Atlas)

---

## 📦 Installation

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd MAJORPROJECT
npm install
```

---

## ⚙️ Configuration

### Backend Setup (MongoDB Local)
1. Create `.env` file in `/server`:
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/restaurohub
JWT_SECRET=restaurohub_secret_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Backend Setup (MongoDB Atlas)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurohub
```

### Frontend Setup
`.env` file already configured in `/MAJORPROJECT/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
```
Backend running at: `http://localhost:5000`

### Terminal 2: Start Frontend Development Server
```bash
cd MAJORPROJECT
npm run dev
```
Frontend running at: `http://localhost:5173`

### (Optional) Seed Demo Data
```bash
cd server
npm run seed
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Staff | staff@example.com | password123 |
| Customer | customer@example.com | password123 |

---

## 📁 Project Structure

```
restaurohub/
├── MAJORPROJECT/          # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── services/      # API services
│   │   ├── utils/         # Helper functions
│   │   └── App.jsx
│   └── package.json
│
└── server/               # Express Backend
    ├── controllers/      # Route handlers
    ├── models/           # MongoDB schemas
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    ├── config/           # Configuration
    ├── utils/            # Utilities
    └── server.js
```

---

## 🎯 Features

### ✅ Completed
- User Authentication (Signup/Login)
- Role-based Authorization
- Menu Management
- Order Management
- Reservation System
- Staff Management
- Admin Dashboard with Analytics
- Dark/Light Mode
- Responsive Design
- API Integration

---

## 🔧 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
npm run seed     # Seed database with demo data
```

---

## 📝 API Documentation

See `README.md` for complete API endpoint documentation.

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally: `mongod`
- Or update `.env` with MongoDB Atlas connection string

### CORS Error
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend and backend URLs match

### Port Already in Use
```bash
# Change port in server/.env
PORT=5001
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vite.dev)

---

## 🤝 Support

For issues, refer to the comprehensive README.md file in the project root.

---

**Happy coding! 🚀**
