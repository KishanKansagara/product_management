# Product Management API

A Node.js REST API for product management with MongoDB.

## Features

- User Registration & Login (JWT Authentication)
- CRUD operations on Products
- Search products by name or product code
- Filter products by category and status
- Only product owner can update/delete their products
- Price change validation (-10% to +10% of original price)
- Image upload support
- Pagination support


## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/product_management
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

4. Start MongoDB (make sure MongoDB is running)

5. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints
### Authentication
| POST | `/api/auth/register` 
| POST | `/api/auth/login`
| GET | `/api/auth/me`

### Products
| GET | `/api/products` 
| GET | `/api/products/my-products`
| GET | `/api/products/:id`
| POST | `/api/products` 
| PUT | `/api/products/:id` 
| DELETE | `/api/products/:id`

