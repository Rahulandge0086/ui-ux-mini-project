# Urban Cart - Full Stack Ecommerce Platform

A modern, fully functional ecommerce website built with Next.js, featuring a complete shopping experience with authentication, product catalog, shopping cart, and checkout functionality.

## 🎨 Features

### Frontend
- **Modern UI Design**: Orange and white theme matching the Figma design
- **Responsive Design**: Mobile-first approach, fully responsive
- **Product Catalog**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items, adjust quantities
- **User Authentication**: Login and registration with JWT
- **Checkout**: Multi-step checkout with shipping and payment
- **Order Management**: View order history and tracking

### Backend
- **Next.js API Routes**: RESTful API endpoints
- **Authentication**: JWT-based user authentication
- **Product Management**: Product listing and detail endpoints
- **Order Management**: Create and retrieve orders
- **Mock Database**: In-memory data storage (easily convertible to MongoDB)

### Technologies Used
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **State Management**: Zustand
- **Authentication**: JWT, bcryptjs
- **Icons**: React Icons
- **API**: Next.js API Routes
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Extract the project files** to your desired directory

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables** (optional)
   ```bash
   touch .env.local
   ```
   
   Add to `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   JWT_SECRET=your-super-secret-key-change-in-production
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📝 Demo Credentials

### Test Login
- **Email**: user@example.com
- **Password**: password

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── products/          # Product endpoints
│   │   └── orders/            # Order endpoints
│   ├── page.tsx               # Home page
│   ├── shop/                  # Shop page
│   ├── product/[id]/          # Product detail page
│   ├── cart/                  # Shopping cart page
│   ├── checkout/              # Checkout page
│   ├── order-confirmation/    # Order confirmation page
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── orders/                # Order history page
│   └── layout.tsx             # Root layout
├── components/
│   ├── Header.tsx             # Header navigation
│   ├── Footer.tsx             # Footer component
│   └── ProductCard.tsx        # Product card component
├── store/
│   ├── cartStore.ts           # Cart state management
│   └── authStore.ts           # Auth state management
├── lib/
│   ├── auth.ts                # Authentication utilities
│   └── mockData.ts            # Mock database
└── globals.css                # Global styles
```

## 🛣️ Page Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with featured products |
| `/shop` | Product listing with filters |
| `/product/[id]` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Multi-step checkout |
| `/order-confirmation/[id]` | Order confirmation |
| `/orders` | Order history (authenticated) |
| `/login` | User login |
| `/register` | User registration |

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/[id]` - Get product details

### Orders
- `GET /api/orders` - Get user orders (authenticated)
- `POST /api/orders` - Create new order (authenticated)

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  orange: {
    DEFAULT: '#FF6633',  // Change primary color
    light: '#FFE8D6',
    dark: '#E55A1F',
  },
}
```

### Add More Products
Edit `src/lib/mockData.ts` and add to `MOCK_PRODUCTS` array:
```typescript
{
  id: '13',
  name: 'New Product',
  price: 5999,
  image: 'https://...',
  // ... other properties
}
```

### Connect Real Database
1. Install MongoDB: `npm install mongoose`
2. Update `src/lib/mockData.ts` to use MongoDB instead of in-memory arrays
3. Create database models for products, users, and orders
4. Update API routes to use database queries

## 🚢 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms
The project is Next.js compatible with any Node.js hosting:
- Netlify
- AWS
- Digital Ocean
- Heroku
- Railway

## 🔒 Security Considerations

For production deployment:
1. **Change JWT Secret**: Update `JWT_SECRET` in environment variables
2. **Use HTTPS**: Always use HTTPS in production
3. **Database**: Replace mock data with real database
4. **Password Hashing**: Implement proper bcrypt hashing for passwords
5. **Rate Limiting**: Add rate limiting to API routes
6. **Input Validation**: Add comprehensive input validation
7. **CORS**: Configure CORS properly for your domain

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Environment Variables Not Working
Restart the development server after creating `.env.local`

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand Store](https://github.com/pmndrs/zustand)
- [React Icons](https://react-icons.github.io/react-icons/)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.

## 📞 Support

For questions or issues, please:
1. Check the troubleshooting section
2. Open an issue on GitHub
3. Check existing documentation

## 🎯 Future Enhancements

- [ ] MongoDB integration
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Social login
- [ ] Advanced search with filters
- [ ] User profiles and addresses
- [ ] Inventory management

---

**Happy Shopping! 🛒**

Built with ❤️ using Next.js and React
