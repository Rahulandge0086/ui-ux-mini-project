# 📚 Urban Cart API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Uses JWT (JSON Web Tokens). Include token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 🔐 Authentication Endpoints

#### 1. Register User
**POST** `/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Registration successful"
}
```

**Error Responses:**
- `400` - Missing required fields or validation error
- `409` - Email already registered

---

#### 2. Login User
**POST** `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+91 98765 43210",
    "address": "123 Main St, Mumbai",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Login successful"
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid email or password

---

### 📦 Product Endpoints

#### 1. Get All Products
**GET** `/products`

**Query Parameters:**
- `category` (optional) - Filter by category (electronics, men, women, baby, home, tv, offers)
- `search` (optional) - Search by product name or description

**Example:**
```
GET /products?category=electronics&search=watch
```

**Response (200):**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Pro Garlic Tap Round Smart Watch",
      "price": 7999,
      "image": "https://...",
      "category": "Electronics",
      "description": "Latest smart watch with health tracking",
      "rating": 4.5,
      "reviews": 156,
      "battery": "2000-2499 mAh",
      "color": ["black", "gold", "silver"],
      "inStock": true
    },
    ...
  ],
  "total": 12
}
```

**Error Responses:**
- `500` - Server error

---

#### 2. Get Single Product
**GET** `/products/{id}`

**Parameters:**
- `id` - Product ID (required)

**Example:**
```
GET /products/1
```

**Response (200):**
```json
{
  "product": {
    "id": "1",
    "name": "Pro Garlic Tap Round Smart Watch",
    "price": 7999,
    "image": "https://...",
    "category": "Electronics",
    "description": "Latest smart watch with health tracking and notifications",
    "rating": 4.5,
    "reviews": 156,
    "battery": "2000-2499 mAh",
    "color": ["black", "gold", "silver"],
    "inStock": true
  }
}
```

**Error Responses:**
- `404` - Product not found
- `500` - Server error

---

### 🛒 Order Endpoints

#### 1. Create Order
**POST** `/orders`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "items": [
    {
      "id": "1",
      "name": "Smart Watch",
      "price": 7999,
      "quantity": 1,
      "image": "https://..."
    },
    {
      "id": "2",
      "name": "iPhone 17",
      "price": 90999,
      "quantity": 1,
      "image": "https://..."
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "totalAmount": 99998
}
```

**Response (201):**
```json
{
  "order": {
    "id": "ORD-1713512890123",
    "userId": "1",
    "items": [...],
    "shippingAddress": {...},
    "totalAmount": 99998,
    "status": "pending",
    "createdAt": "2024-04-19T10:00:00Z"
  },
  "message": "Order created successfully"
}
```

**Error Responses:**
- `401` - Unauthorized (missing or invalid token)
- `400` - Cart is empty
- `500` - Server error

---

#### 2. Get User Orders
**GET** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "orders": [
    {
      "id": "ORD-1713512890123",
      "userId": "1",
      "items": [
        {
          "id": "1",
          "name": "Smart Watch",
          "price": 7999,
          "quantity": 1
        }
      ],
      "shippingAddress": {
        "firstName": "John",
        "lastName": "Doe",
        "address": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zipCode": "400001"
      },
      "totalAmount": 7999,
      "status": "confirmed",
      "createdAt": "2024-04-19T10:00:00Z"
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized (missing or invalid token)
- `500` - Server error

---

## Data Models

### User Model
```typescript
{
  id: string
  email: string
  password: string (hashed)
  name: string
  phone?: string
  address?: string
  role: 'user' | 'admin'
  createdAt?: Date
  updatedAt?: Date
}
```

### Product Model
```typescript
{
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number (0-5)
  reviews: number
  battery?: string
  color?: string[]
  inStock: boolean
  createdAt?: Date
  updatedAt?: Date
}
```

### Order Model
```typescript
{
  id: string
  userId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: Date
  updatedAt?: Date
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing authentication |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Error Response Format

All error responses follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Example API Calls

### Using cURL

#### 1. Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "MySecurePassword123",
    "name": "Jane Doe"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

#### 3. Get Products
```bash
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products?category=electronics
```

#### 4. Get Single Product
```bash
curl http://localhost:3000/api/products/1
```

#### 5. Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -d '{
    "items": [
      {
        "id": "1",
        "name": "Smart Watch",
        "price": 7999,
        "quantity": 1,
        "image": "https://..."
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+91 98765 43210",
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India"
    },
    "totalAmount": 7999
  }'
```

#### 6. Get My Orders
```bash
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer your_jwt_token_here"
```

---

### Using Postman

1. **Import Collection**
   - Create new collection in Postman
   - Add requests for each endpoint
   - Set base URL: `http://localhost:3000/api`

2. **Authentication**
   - After login, copy the token
   - In Authorization tab, select "Bearer Token"
   - Paste the token

3. **Test Requests**
   - Send requests to each endpoint
   - Verify responses match documentation

---

### Using JavaScript/Fetch

#### Register
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password',
    name: 'John Doe'
  })
})

const data = await response.json()
console.log(data)
```

#### Login and Save Token
```javascript
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
})

const loginData = await loginResponse.json()
localStorage.setItem('token', loginData.token)
```

#### Get Products
```javascript
const response = await fetch('/api/products?category=electronics')
const data = await response.json()
console.log(data.products)
```

#### Create Order (with token)
```javascript
const token = localStorage.getItem('token')

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: [...],
    shippingAddress: {...},
    totalAmount: 5000
  })
})

const data = await response.json()
console.log(data.order)
```

---

## Rate Limiting

Currently not implemented, but should be added in production:

```bash
npm install express-rate-limit
```

Recommended limits:
- Login: 5 requests per 15 minutes
- Register: 3 requests per hour
- API calls: 100 requests per minute

---

## Testing

### Unit Tests
```bash
npm install --save-dev jest @testing-library/react
npm test
```

### Integration Tests
Test API endpoints with Postman or Insomnia

### Load Testing
Use Apache JMeter or Locust for load testing

---

## Pagination (Future)

**GET** `/products?page=1&limit=20`

```json
{
  "products": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```

---

## Filtering (Expanded)

**GET** `/products?category=electronics&minPrice=1000&maxPrice=50000&rating=4`

---

## Webhook Support (Future)

For order status updates:
```
POST /webhooks/order-status
```

---

## API Versioning (Future)

```
GET /api/v2/products
POST /api/v2/orders
```

---

## Deprecated Endpoints

None at this time.

---

## Contact & Support

For API issues or questions:
- Check the main README.md
- Review troubleshooting section
- Check Next.js API Routes documentation

---

**Last Updated**: April 2024
**API Version**: 1.0.0
**Status**: Production Ready
