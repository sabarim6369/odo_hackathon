# 🌱 EcoFinds - Sustainable Second-Hand Marketplace

**A React-based frontend prototype for a sustainable second-hand marketplace that promotes circular economy through quality pre-owned items.**

## 🎯 Project Overview

EcoFinds is a demo frontend application built for the Odoo Hackathon, showcasing a complete e-commerce platform for buying and selling second-hand items. The application features modern UI/UX design, comprehensive product management, cart functionality, and user authentication flows.

## ✨ Features

### 🔐 Authentication (Mocked)
- **Login & Signup** - Beautiful auth forms with validation
- **Protected Routes** - Automatic redirection for authenticated actions
- **User Profile Management** - Edit profile information
- **Session Persistence** - User state maintained across browser sessions

### 🛍️ Product Management
- **Product Feed** - Grid view of all available products with search and filters
- **Product Details** - Detailed view with image gallery and specifications
- **Add Product** - Complete form with image upload and validation
- **My Listings** - Manage your own products with edit/delete options
- **Categories & Search** - Filter by category and search by keywords

### 🛒 Shopping Experience
- **Shopping Cart** - Add/remove items with quantity management
- **Mock Checkout** - Simulated payment process
- **Purchase History** - Track your orders and delivery status
- **Payment History** - Detailed transaction records with export functionality

### 📱 Responsive Design
- **Mobile-First** - Optimized for all screen sizes
- **Accessible** - ARIA roles, focus states, and keyboard navigation
- **Modern UI** - Clean design with eco-friendly color scheme

## 🛠️ Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Development**: ESLint, Vite HMR

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ (or 22.12+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd odoo_hackathon/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🎭 Demo Instructions

### Quick Demo Flow
1. **Browse Products** - Start on the homepage to view all products
2. **Try Protected Actions** - Click "Add Product" or "Add to Cart" without logging in (redirects to login)
3. **Sign Up/Login** - Use any valid email and password (minimum 6 characters)
4. **Add a Product** - Fill out the product form with validation
5. **Shopping Flow** - Add items to cart → checkout → view purchase history
6. **Dashboard** - View profile, stats, and quick actions
7. **Payment History** - View detailed transaction records

### Sample Login Credentials
- **Email**: demo@ecofinds.com
- **Password**: password123
- Or create your own account with any valid email format

## 🏗️ Project Structure

```
client/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route components (all main pages)
│   ├── stores/           # Zustand state management
│   ├── utils/            # Validation schemas and helpers
│   └── App.jsx           # Main app with routing
└── package.json          # Dependencies and scripts
```

## 🎨 Key Features Implemented

- ✅ **Complete Authentication Flow** (mocked)
- ✅ **Product CRUD Operations** with validation
- ✅ **Shopping Cart & Checkout** (mock payment)
- ✅ **Responsive Design** (mobile, tablet, desktop)
- ✅ **Search & Filtering** by category and keywords
- ✅ **User Dashboard** with profile management
- ✅ **Purchase & Payment History** with export
- ✅ **Form Validation** with real-time feedback
- ✅ **State Persistence** across browser sessions
- ✅ **Accessibility Features** (ARIA, keyboard navigation)

## 🔧 Technical Highlights

- **Modern React Patterns**: Hooks, context, and functional components
- **Performant State Management**: Zustand with selective subscriptions
- **Type-Safe Validation**: Zod schemas for all forms
- **Responsive Grid Layouts**: Tailwind CSS utility classes
- **Error Boundaries**: Graceful error handling
- **Clean Code Architecture**: Modular, reusable components

---

**Built with ❤️ for sustainable living and circular economy**

*This is a frontend prototype created for the Odoo Hackathon. All data is mocked for demonstration purposes.*
