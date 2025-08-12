# 🌐 Averzo – The Next-Gen E-Commerce Marketplace

**Averzo** is a **modern, full-stack e-commerce platform** inspired by leading online marketplaces like Myntra & Amazon.  
Built with **Next.js**, **Tailwind CSS**, and **Firebase**, Averzo delivers a **lightning-fast, intuitive, and mobile-friendly shopping experience** for buyers, while offering powerful tools for administrators.

> 🚀 *Averzo aims to be the future of online shopping with real-time inventory, flash sales, PWA support, and blazing-fast search.*

---

## ✨ Key Features

### 🛒 Core E-Commerce
- **Smart Navigation:** Mother Category → Category → Sub-category with dynamic Mega Menu.  
- **Dynamic Homepage:**  
  - Rotating **banner carousel**  
  - **Trending products** section  
  - **Exclusive category cards**  
  - **Flash sales** with countdown timers  
  - **Pre-booking** for upcoming products  
- **Advanced Product Listing:** Filters by category, price, brand, rating, size & color.  
- **Product Detail Page:** Zoomable images, Add to Cart, Wishlist, Reviews & Ratings.  
- **Full Cart System:** Quantity updates, auto total calculation, remove/add items.  
- **Secure Checkout:** Multiple payment gateways + dedicated address form.  
- **Order Tracking:** Live status updates & order history.

---

### 👥 User & Admin Experience
- **Role-Based Authentication:** Buyer & Admin roles with Email/Password + Google login.  
- **Admin Panel:** Manage products, categories, orders, promo codes from one dashboard.  
- **Stock Management:** Real-time inventory updates, low-stock alerts, sold-out badges.  
- **User Profile:** Saved addresses, profile picture, wishlist management.

---

### 🚀 Advanced & Unique Features
- **Flash Sales & Pre-book:** Real-time countdown + early booking options.  
- **Promotional System:** Dynamic discount codes with validation.  
- **Instant Search:** Full-text search with instant suggestions.  
- **PWA Ready:** Installable on mobile & desktop with offline mode.  
- **Push Notifications:** Order updates, new promotions & alerts.

---

## 🛠️ Technology Stack
| Layer         | Tech Used |
|--------------|-----------|
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Styling**  | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Backend**  | [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage) |
| **Search**   | Firebase Native Search *(Algolia planned)* |
| **Hosting**  | [Vercel](https://vercel.com/) |
| **Payments** | Stripe / Razorpay *(Planned)* |
| **Notifications** | Firebase Cloud Messaging |

---

## 📦 Installation & Setup

```bash
# 1️⃣ Clone the Repository
git clone https://github.com/dipanjanswapna/averzotech.git
cd averzotech

# 2️⃣ Install Dependencies
npm install

# 3️⃣ Firebase Setup
# - Create project in Firebase Console
# - Enable Authentication, Firestore & Storage
# - Copy your Firebase config

# 4️⃣ Environment Variables
# Create `.env.local` in root & add:
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"

# 5️⃣ Run Development Server
npm run dev

---

This **README** is:
- ✅ **GitHub markdown friendly**
- 🎨 **Stylish & structured** with tables, sections & icons
- 📈 **SEO-optimized** with relevant keywords for better search ranking
- 💡 **Clear setup instructions** for easy onboarding

If you want, I can also make a **banner-style header image** for the top of the README to make it look like a **premium GitHub project**. That will boost visual appeal and clicks.
