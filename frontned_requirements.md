# 📄 Project Requirements Document (PRD)

## Project Title: **EcoFinds - Sustainable Second-Hand Marketplace**
**Hackathon Problem Statement:** Create a foundational frontend prototype of EcoFinds with core product browsing, listing, cart, and profile functionalities. Authentication flow is mocked for now (UI only).

---

## 1. 🎯 Project Overview
EcoFinds is a sustainable second-hand marketplace aimed at promoting a circular economy. The platform allows users to **buy and sell pre-owned items** with an easy-to-use, responsive interface.  

This version focuses only on **frontend** using **React + Tailwind CSS + Zustand**, with no backend integration yet.  

The **key priorities**:
- Beautiful, responsive UI across mobile & desktop.
- Core pages and user flows.
- Intuitive navigation with mock login redirection.
- Validation of all user inputs.
- Maintainable, human-readable code structure.

---

## 2. 📌 Goals & Non-Goals

### ✅ Goals
- Build frontend for **product browsing, listing, and cart system**.
- Provide **mock authentication redirection** (redirect to login page if user not logged in when performing restricted actions).
- Use **Zustand for global state management** (products, cart, user profile, login status).
- Implement **basic search, category filter, and sorting**.
- Ensure **responsive, accessible design** for mobile & desktop.
- Include **Payment History Page** (static UI for now).

### ❌ Non-Goals (for now)
- No real backend integration.
- No actual payment gateway.
- No advanced recommendation or AI features.

---

## 3. ⚙️ Tech Stack
- **Frontend Framework:** React (Vite/CRA)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router
- **Form Handling & Validation:** React Hook Form + Zod (for schema validation)
- **Icons:** Lucide React or Heroicons

---

## 4. 📑 Core Features & Pages

### 4.1 Authentication (Mocked UI)
- Login & Sign-up screens (email, password, username).
- User is redirected to login if not authenticated when:
  - Adding product
  - Editing/deleting product
  - Adding to cart
  - Viewing dashboard, cart, purchase history

### 4.2 Product Feed (Default Landing Page)
- Displays product list (grid / card view).
- Elements per product card:
  - Placeholder image
  - Title
  - Price
- Includes:
  - Search bar (by title/keyword)
  - Category filter (dropdown or horizontal list)
  - "+" button to add new product

### 4.3 Product Detail Page
- Larger image placeholder
- Title, Price, Category, Description
- Buttons: **Add to Cart** / **Buy Now** (redirects to mock payment)

### 4.4 Add New Product Page
- Input fields:
  - Product Title
  - Category (dropdown)
  - Description
  - Price (number)
  - Image Placeholder (button)
- Form validation: all fields required, price numeric > 0

### 4.5 My Listings Page
- List of user’s products
- Each item: Image, Title, Price
- Options: **Edit** / **Delete**

### 4.6 User Dashboard
- User profile view/edit
- Fields: Username, Email, Profile Image Placeholder
- Editable inputs with validation

### 4.7 Cart Page
- Shows all products added to cart
- Each item: Product Card (Image, Title, Price)
- Buttons: **Remove from Cart** / **Checkout (Mock)**

### 4.8 Previous Purchases Page
- List view of purchased items (mock data)
- Each item: Title, Price, Date of Purchase

### 4.9 Payment History Page
- Table/List view of transactions (mock data)
- Fields: Transaction ID, Product Name, Amount, Status, Date

---

## 5. 🎨 Design & UX Guidelines
- **Theme:** Minimal, eco-friendly vibes (soft green + neutral colors).
- **Layout:** Grid for product cards, responsive flexbox.
- **Typography:** Clear, modern sans-serif (e.g., Inter, Poppins).
- **Forms:** Rounded inputs, clear error states, validation messages.
- **Responsiveness:** Must work seamlessly on **desktop, tablet, mobile**.
- **Accessibility:** ARIA roles, contrast, focus states.

---

## 6. 🗂️ State Management (Zustand Stores)

### `userStore.js`
- `user`: { id, username, email, isLoggedIn }
- Actions: login, logout, updateProfile

### `productStore.js`
- `products`: []
- Actions: addProduct, editProduct, deleteProduct, searchProducts, filterByCategory

### `cartStore.js`
- `cartItems`: []
- Actions: addToCart, removeFromCart, clearCart

---

## 7. 🧪 Input Validation
- **Login/Signup:** Email format check, password length ≥ 6
- **Add Product:**
  - Title: required, ≤ 100 chars
  - Description: required, ≤ 500 chars
  - Price: numeric, > 0
  - Category: required

---

## 8. 🚦 User Flows
1. **Landing → Product Feed** (default)
2. **Not logged in + tries action → Redirect to Login**
3. **Login → Dashboard / Feed**
4. **Add Product → Submit → Product Feed updates**
5. **Product Card → Click → Product Detail**
6. **Add to Cart → Cart Page → Checkout → Mock Payment → Previous Purchases update**
7. **Dashboard → Update Profile → Save**
8. **Payment History → Static UI of transactions**

---

## 9. ✅ Deliverables
- Fully functional **React frontend** with:
  - All required pages & navigation
  - Responsive design
  - Mock authentication redirection
  - Zustand-powered state management
  - Input validation
  - Payment History page included
