# 🛒 E-Commerce App

A modern e-commerce web app built with React, TypeScript, and Firebase.

## ✨ Features

- 🔐 User authentication & profile management
- 🔍 Product search, filtering & sorting
- 🛍️ Shopping cart with persistent storage
- 📱 Fully responsive design
- ⚡ Real-time updates


## 🛠️ Tech Stack

| Category | Tools |
|----------|-------|
| **Frontend** | React 18, TypeScript, Vite |
| **State Management** | Redux Toolkit |
| **Styling** | Tailwind CSS |
| **Backend** | Firebase |
| **Routing** | React Router v7 |
| **Forms** | React Hook Form |
| **HTTP Client** | Axios |
| **UI Components** | Headless UI, React Icons |



## 📋 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation

```bash
# Clone & install
git clone <your-repo-url>
cd ecommerce-app
npm install

# Set up Firebase config
# Create .env.local and add your Firebase credentials:
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Start development
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build & Deploy

```bash
npm run build    # Production build
npm run preview  # Test build locally
```



## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Redux slices (auth, cart, product, user)
├── pages/          # Page components (routes)
├── services/       # API calls
├── hooks/          # Custom React hooks
├── types/          # TypeScript interfaces
├── firebase/       # Firebase config
└── app/            # Redux store
```


## 🔑 Key Features

- **Redux State Management** - Centralized state for auth, cart, products, and user data
- **Type-Safe** - Full TypeScript support throughout the app
- **Firebase Integration** - Authentication, real-time data, and backend services
- **Form Validation** - React Hook Form for robust form handling
- **Protected Routes** - Private & guest route wrappers for access control
- **Tailwind CSS** - Modern, utility-first styling

## 📞 Questions?

For issues or questions, open a GitHub issue or reach out via email: maieltayeb21@gmail.com.

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

## 🙏 Acknowledgments

- React community
- Firebase team
- Tailwind CSS for styling
- All contributors and supporters

---

**Happy Coding! 🚀**
