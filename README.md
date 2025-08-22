Here's a **README.md** draft for your **Warungku** application setup.

---

```markdown
# 🛒 Warungku – Grocery Store API

Warungku is a backend application built with **Express.js**, **TypeScript**, and **Prisma ORM** for managing users, products, and transactions in a small grocery store system.  
It also implements **caching (Memcached)**, **logging**, and **centralized error handling** with a custom `AppError` class.

---

## 📂 Project Structure

```

src/
├── controllers/       # Request handlers
├── dto/               # Data Transfer Objects
├── middleware/        # Middlewares (logging, error handling, auth, etc.)
├── routers/           # API routes
├── services/          # Business logic
├── utils/             # Utilities (AppError, logger, cache client)
└── app.ts             # Express app entry point

````

---

## 🗄 Database

The application uses **Prisma ORM** with **PostgreSQL** as the database.  

### Database Schema

- **User**
  - `id_user`
  - `username`
  - `email`
  - `password`

- **Product**
  - `id_product`
  - `title`
  - `price`
  - `stock`

- **Transaction**
  - `id_transaction`
  - `id_invoice`
  - `total_amount`

Prisma migrations are used to manage schema changes.

---

## ⚡ Caching (Memcached)

We use **Memcached** to improve performance by caching frequently requested data:

- **Products**: Cached when fetching product lists/details because they are read often and rarely updated.
- **Transactions**: Cached when fetching transaction history for performance in dashboards.

Caching helps reduce unnecessary database hits and improves response times.

### Installation

#### 1. Install Memcached (Linux/Ubuntu example)
```bash
sudo apt update
sudo apt install memcached -y
sudo systemctl start memcached
sudo systemctl enable memcached
````

#### 2. Install Client Library

```bash
npm install memjs
```

#### 3. Configuration

Set the environment variable:

```
MEMCACHED_URL=localhost:11211
```

---

## 📝 Logging

We use **three levels of logging**:

1. **Runtime console logging** → for development debugging.
2. **File logging (fs module)** → to persist request/response info into log files.
3. **Winston logging** → structured, production-ready logging with levels (info, error, warn).

### Why Logging?

* To trace issues in production.
* To audit transactions and stock changes.
* To debug unexpected errors.

---

## ❗ Error Handling with AppError

A **custom `AppError` class** standardizes error handling.

* Each error carries:

  * `statusCode` (HTTP status)
  * `isOperational` (expected vs. unexpected)
* Centralized in `errorHandler.ts` middleware.
* Helps separate **expected errors** (e.g., "User not found") from **unexpected ones** (e.g., DB connection failure).

Example:

```ts
throw new AppError("Product not found", 404, true);
```

Response:

```json
{
  "status": "error",
  "message": "Product not found"
}
```

Unexpected errors return a generic:

```json
{
  "status": "error",
  "message": "Internal Server Error"
}
```

---

## 🚀 Getting Started

### 1. Clone Repo

```bash
git clone https://github.com/your-username/warungku.git
cd warungku
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```
DATABASE_URL="postgresql://username:password@localhost:5432/warungku"
MEMCACHED_URL="localhost:11211"
PORT=8080
```

### 4. Run Database Migration

```bash
npx prisma migrate dev
```

### 5. Start Development Server

```bash
npm run dev
```

---

## 📌 API Endpoints

### Users

* `POST /api/users/register`
* `POST /api/users/login`
* `GET /api/users/:id`

### Products

* `GET /api/products` (cached)
* `POST /api/products`
* `PUT /api/products/:id`
* `DELETE /api/products/:id`

### Transactions

* `POST /api/transactions`
* `GET /api/transactions/:id` (cached)

---

## 🛠 Tools & Tech

* **Express.js** – Web framework
* **TypeScript** – Type safety
* **Prisma ORM** – Database schema & queries
* **PostgreSQL** – Relational database
* **Memcached** – Caching
* **Winston + fs + console** – Logging
* **AppError** – Centralized error handling

---

## 👨‍💻 Author

**Warungku Backend** – Developed for learning purposes by Bagas Dhitya Taufiqqi.

```

---

Mau saya tambahkan juga **contoh request/response API (dengan JSON body)** di readme biar lebih gampang dipahami kalau ada yang mau testing langsung?
```
