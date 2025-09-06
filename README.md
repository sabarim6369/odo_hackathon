# 🌿 EcoFinds - Sustainable Second-Hand Marketplace


## 📖 Overview

EcoFinds is a comprehensive sustainable second-hand marketplace that promotes a circular economy by enabling users to buy and sell pre-owned items. Built with modern web technologies, it features a React frontend, Node.js backend, and includes an AI-powered chatbot for enhanced user experience.

## 🚀 Features

### Core Functionality
- **Product Marketplace**: Browse, search, and filter through a variety of second-hand products
- **User Authentication**: Secure registration and login system with JWT tokens
- **Shopping Cart**: Add products to cart and manage purchases
- **Wishlist**: Save favorite products for later
- **Location-based Services**: Location detection for local product discovery
- **Real-time Search**: Debounced search with instant results
- **AI Chatbot**: Gemini-powered shopping assistant for product recommendations

### User Features
- **Product Listing**: Sellers can list products with multiple images and detailed descriptions
- **Product Categories**: Organized browsing by categories
- **Purchase History**: Track all past purchases
- **Profile Management**: User profile with purchase history and settings
- **Responsive Design**: Optimized for mobile and desktop devices

### Technical Features
- **Modern UI**: Built with React 19, Tailwind CSS, and Framer Motion
- **State Management**: Zustand for efficient global state management
- **Image Upload**: Cloudinary integration for image storage
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Features**: Redis for caching and session management
- **API Integration**: RESTful APIs with comprehensive error handling

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Modern database toolkit
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Redis** - Caching and session storage
- **Cloudinary** - Image upload and management
- **Gemini AI** - AI chatbot integration

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server auto-restart
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
odoo_hackathon/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── stores/            # Zustand state stores
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── assets/            # Static assets
│   ├── public/                # Public assets
│   └── package.json
│
├── server/                     # Backend Node.js application
│   ├── controllers/           # Request handlers
│   ├── routes/               # API route definitions
│   ├── middleware/           # Custom middleware
│   ├── prisma/              # Database schema and migrations
│   ├── services/            # Business logic services
│   └── package.json
│
├── README.md                 # Project documentation
└── frontned_requirements.md # Detailed requirements
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v20.14.0 or higher recommended)
- npm or yarn
- PostgreSQL database
- Redis server (optional, for caching)

### Environment Variables

Create a `.env` file in the `server` directory:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret_key"
GEMINI_API_KEY="your_gemini_api_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
AMQP_URL="your_rabbitmq_connection_string"
```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sabarim6369/odoo_hackathon.git
   cd odoo_hackathon
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm start
   ```
   The backend will run on `http://localhost:5000`

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or next available port)

### Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file
3. Run Prisma migrations:
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

## 🎯 Usage

### For Buyers
1. **Browse Products**: Visit the homepage to see available products
2. **Search & Filter**: Use the search bar and category filters
3. **Product Details**: Click on any product to view detailed information
4. **Add to Cart**: Add products to your shopping cart
5. **Checkout**: Proceed to purchase products
6. **AI Assistant**: Use the floating chat button for product recommendations

### For Sellers
1. **Create Account**: Register and login to your account
2. **List Products**: Navigate to "Add Product" to list your items
3. **Manage Listings**: View and manage your product listings
4. **Track Sales**: Monitor your sales through the dashboard

### AI Chatbot Features
- **Product Recommendations**: Get personalized product suggestions
- **Search Assistance**: Help finding specific products
- **Platform Guidance**: Learn about marketplace features
- **Sustainability Tips**: Get advice on sustainable shopping

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Products
- `GET /products/allproducts` - Get all products
- `GET /products/prod/:id` - Get product by ID
- `POST /products/add` - Add new product
- `POST /products/prod/related` - Get related products

### Cart & Purchases
- `GET /cart` - Get user cart
- `POST /cart/add` - Add to cart
- `POST /purchases/add` - Create purchase

### Chat
- `POST /api/chat` - AI chatbot interaction

## 🎨 Design Principles

- **Sustainability First**: Green color scheme and eco-friendly messaging
- **Mobile-First**: Responsive design optimized for all devices
- **User-Centric**: Intuitive navigation and clear call-to-actions
- **Performance**: Optimized loading with skeleton screens and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🔮 Future Enhancements

- **Payment Integration**: Stripe/PayPal integration
- **Real-time Chat**: User-to-user messaging
- **Advanced Filters**: Price range, condition, distance
- **Social Features**: User ratings and reviews
- **Mobile App**: React Native mobile application
- **Analytics Dashboard**: Seller analytics and insights
- **Recommendation Engine**: ML-powered product recommendations

## 🐛 Known Issues

- Node.js version warning with Vite (requires v20.19+ or v22.12+)
- Redis connection errors in development (non-critical)

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for a sustainable future** 🌱
