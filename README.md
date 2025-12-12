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

4. Start MongoDB (make sure MongoDB is running)

5. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- express-validator for input validation

