<div align="center">

# 🛒 Grocery Store Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/PayPal-Integration-00457c?style=for-the-badge&logo=paypal" alt="PayPal"/>
</p>

A modern, responsive frontend for the Grocery Store e-commerce application built with Next.js and Tailwind CSS.

</div>

## 📋 Overview

This is the frontend component of the Grocery Store application, providing a sleek and intuitive user interface for browsing products, managing shopping carts, and completing purchases securely through PayPal integration.

## ✨ Features

- 🏪 Browse products by categories
- 🔍 Search and filter products
- 🛒 Shopping cart management
- 💳 Secure checkout with PayPal
- 🔐 User authentication
- 📱 Fully responsive design
- 🌙 Light/dark mode support
- 🖼️ Optimized images

## 🚀 Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- npm or yarn
- Backend API (Strapi) running

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/FadnisW/grocery-frontend.git
   cd grocery-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:1337/api
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
├── app/                  # Next.js app directory
│   ├── (auth)/           # Authentication pages
│   ├── (routes)/         # Application routes
│   ├── _components/      # Shared components
│   ├── _Context/         # React context providers
│   ├── category/         # Category pages
│   ├── product/          # Product pages
│   ├── utils/            # Utility functions
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout
│   └── page.js           # Home page
├── components/           # UI components
├── lib/                  # Library code
├── public/               # Static assets
└── tailwind.config.js    # Tailwind configuration
```

## 🌐 Deployment

The Next.js frontend can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy

## 🔧 Environment Variables

```
NEXT_PUBLIC_BACKEND_BASE_URL=https://your-backend-url.com/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## 📚 Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Headless UI components
- Axios for API requests
- PayPal React SDK
- Embla Carousel
- React Icons

## 📝 License

This project is licensed under the MIT License.

---

<div align="center">

### 🌟 Happy Shopping! 🌟

</div>
