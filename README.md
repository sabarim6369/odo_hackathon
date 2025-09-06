# 🛍️ Odoo Hackathon – Second-Hand E-Commerce Platform  

A **second-hand marketplace backend** built during the **Odoo Hackathon**.  
It lets users list, search, and discover pre-owned products with advanced features like **real-time messaging, intelligent search, caching, and chatbot assistance**.  

This project demonstrates how modern backend tools like **RabbitMQ, Redis, Prisma, Elasticsearch, and AI chatbots** can power scalable marketplaces.  

---

## ✨ Features  

- 👤 **User-Owned Listings** – Users can create, update, delete, and manage their product listings  
- 🛒 **Second-Hand Marketplace** – Designed for buying/selling pre-owned goods  
- 🔍 **AI-Powered Search** – Elasticsearch enables full-text search and filtering (fast, typo-tolerant)  
- 💬 **Chatbot Integration** – Buyers can interact with an AI assistant for product queries & recommendations  
- ⚡ **Caching with Redis** – Frequently accessed products and search queries are cached  
- 📩 **RabbitMQ Messaging** – Reliable, asynchronous communication between services (e.g., notifications, analytics)  
- 🎯 **Related Products** – Suggests products in the same category  
- 🛡️ **Resilient Architecture** – Fallbacks ensure service reliability even if cache/broker is down  

---

## 🏗️ Tech Stack  

- **Node.js** – Backend runtime  
- **Express.js** – REST API framework  
- **Prisma ORM + PostgreSQL** – Database layer for structured product data  
- **Redis** – Caching layer for speed  
- **RabbitMQ** – Message broker for async tasks & notifications  
- **Elasticsearch** – Intelligent product search & filtering  
- **Chatbot (LLM Integration)** – Conversational interface for buyers/sellers  

---

## 📂 Project Structure  
```
odoo_hackathon/
│── prisma/ # Prisma schema & migrations
│── Redis/redis.js # Redis client setup
│── rabbitmq/ # RabbitMQ producer/consumer setup
│── elastic/ # Elasticsearch indexing/search helpers
│── chatbot/ # AI assistant integration
│── controllers/product.js # Product logic with caching
│── routes/ # Express routes
│── app.js # Express app entrypoint
│── package.json # Dependencies & scripts
│── README.md # Documentation

```


---

## ⚙️ Setup Instructions  

### 1️⃣ Clone the repo  
```bash
git clone https://github.com/yourusername/odoo_hackathon.git
cd odoo_hackathon

```
### 2️⃣ Install dependencies
```bash
npm install
```
2️⃣ Install dependencies
npm install

3️⃣ Configure Environment Variables (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/odoo_hackathon"
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
RABBITMQ_URL=amqp://localhost
ELASTICSEARCH_NODE=http://localhost:9200

4️⃣ Run Prisma migrations
npx prisma migrate dev

5️⃣ Start required services

Start PostgreSQL

Start Redis

Start RabbitMQ

Start Elasticsearch

(Optional: use Docker Compose for one-command startup.)

6️⃣ Start the server
npm start

📡 API Endpoints
➕ Add a Product (listing)
POST /products


Body:

{
  "title": "Used Laptop",
  "description": "Dell Inspiron, 8GB RAM, good condition",
  "price": 400,
  "categoryId": 1,
  "images": [{ "url": "https://img.com/laptop.jpg" }],
  "attributes": [
    { "key": "Condition", "value": "Used" },
    { "key": "Brand", "value": "Dell" }
  ],
  "quantity": 1
}

🔍 Search Products (Elasticsearch + Redis cache)
GET /products?search=laptop&categoryId=1

📄 Get Product by ID
GET /products/:id

🎯 Related Products
POST /products/related


Body:

{ "categoryId": 1, "productId": 10 }

⚡ Redis Caching

Caches all products, search queries, and product by ID

Cache invalidated on create/update/delete

TTL (default: 60s)

Fallback to PostgreSQL + Elasticsearch if Redis is down

📩 RabbitMQ Messaging

Used for async tasks like:

Sending notifications

Logging user activity (product views, searches)

Updating analytics dashboards

Ensures non-blocking API performance

🔍 Elasticsearch Search

Indexes product title, description, category, and attributes

Features:

Full-text search

Category filters

Fuzzy search (typo-tolerant)

🤖 Chatbot Assistant

AI-powered chatbot helps users:

Answer product-related questions

Suggest similar items

Guide through the buying/selling process

🚀 Hackathon Value

This project stands out because it combines:

✅ Marketplace functionality (CRUD, search, related products)

✅ High-performance caching (Redis)

✅ Asynchronous workflows (RabbitMQ)

✅ Intelligent search (Elasticsearch)

✅ Conversational AI (Chatbot)

Together, it creates a robust second-hand e-commerce ecosystem.

📜 License

MIT License – free to use, modify, and share.

🔥 Built for Odoo Hackathon to power a smarter, faster, second-hand e-commerce platform with AI, caching, and real-time capabilities.


Would you also like me to **embed a ready-to-use `docker-compose.yml`** inside this same Markdown