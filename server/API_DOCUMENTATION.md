# Backend API Documentation

## Overview
Complete PostgreSQL-powered backend with Prisma ORM for the marketplace application.

## Database Models

### User
- id (UUID)
- email (unique)
- password (hashed)
- name
- profilePic (optional)

### Product
- id (UUID)
- title
- description
- price
- category
- location
- createdAt
- userId (owner)
- images (ProductImage array)
- attributes (ProductAttribute array)

### Cart
- id (UUID)
- userId
- productId
- quantity
- Unique constraint: (userId, productId)

### Wishlist
- id (UUID)
- userId
- productId
- Unique constraint: (userId, productId)

### Purchase
- id (UUID)
- buyerId
- productId
- quantity
- totalPrice
- purchaseDate
- buyerEmail

### ProductImage
- id (UUID)
- productId
- url
- publicId (Cloudinary)

### ProductAttribute
- id (UUID)
- productId
- key
- value

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login

### Products (`/api/products`)
- `GET /` - Get all products
- `POST /` - Create product (authenticated)
- `GET /:id` - Get product by ID
- `PUT /:id` - Update product (authenticated, owner only)
- `DELETE /:id` - Delete product (authenticated, owner only)

### Cart (`/api/cart`)
- `GET /` - Get user cart (authenticated)
- `POST /add` - Add item to cart (authenticated)
- `PUT /update/:productId` - Update quantity (authenticated)
- `DELETE /remove/:productId` - Remove item (authenticated)
- `DELETE /clear` - Clear cart (authenticated)

### Wishlist (`/api/wishlist`)
- `GET /` - Get user wishlist (authenticated)
- `POST /add` - Add to wishlist (authenticated)
- `DELETE /remove/:productId` - Remove from wishlist (authenticated)
- `DELETE /clear` - Clear wishlist (authenticated)

### User Profile (`/api/users`)
- `GET /profile` - Get user profile (authenticated)
- `PUT /profile` - Update profile (authenticated)
- `PUT /password` - Change password (authenticated)
- `GET /stats` - Get user statistics (authenticated)

### Purchases (`/api/purchases`)
- `POST /checkout` - Process purchase (authenticated)
- `GET /` - Get user purchases (authenticated)
- `GET /sales` - Get user sales (authenticated)

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Environment Variables Required
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Database Setup
1. Ensure PostgreSQL is running
2. Run `npx prisma generate`
3. Run `npx prisma db push`
4. Optionally run `npx prisma studio` to view data
