# 🏠 Boarding House Finder for Students

## 🌐 Live Demo

| Platform | URL |
|----------|-----|
| **🖥️ Web App** | [https://boardinghouse-web.onrender.com](https://boardinghouse-web.onrender.com) |
| **⚙️ Backend API** | [https://boardinghouse-api-uc53.onrender.com](https://boardinghouse-api-uc53.onrender.com) |

---

## 📖 Project Description
The **Boarding House Finder for Students** is a web and mobile platform that helps students easily search for and connect with available boarding houses near their school. It simplifies the accommodation search by providing detailed listings, map integration, and direct landlord contact.

The system provides **real-time data management**, **secure authentication**, and **cloud-hosted PostgreSQL storage**. The web and mobile interfaces are built to ensure a **seamless and responsive user experience**.

### Key Features:
- 🔍 **Search** for boarding houses by price, distance, room type, and amenities.
- 🏘️ **View listings** with map integration for precise location visibility.
- 📸 **Photo uploads** stored securely in Supabase Storage.
- 🔐 **Google OAuth** for quick and secure sign-in.
- 🧑‍💼 **Landlords:** Post, edit, and manage their property listings.
- 🧑‍💼 **Administrator:** System management, user oversight, and content moderation.
- 🧑‍🎓 **Students:** Save, bookmark, and contact landlords directly through the app.

---

## 🚀 Quick Start Guide

### For Students
1. Visit [https://boardinghouse-web.onrender.com](https://boardinghouse-web.onrender.com)
2. Click **"Sign in with Google"** or create an account manually
3. Browse available boarding houses
4. Use filters to find the perfect place
5. Contact landlords directly through the platform

### For Landlords
1. Visit [https://boardinghouse-web.onrender.com](https://boardinghouse-web.onrender.com)
2. Create an account and select **"Landlord"** as your role
3. Go to **Dashboard** → **Create New Listing**
4. Fill in your property details
5. Upload photos (see below)
6. Submit for admin approval

---

## 📸 How to Upload Photos

### When Creating/Editing a Listing:

1. **Go to** Dashboard → Create New Listing (or Edit existing)
2. **Scroll to** the "Photos" section
3. **Click** "Select Photos" or drag and drop images
4. **Wait** for upload to complete (progress bar will show)
5. **Photos** are automatically stored in Supabase Storage
6. **Click** "Create Listing" to save

### Photo Requirements:
- **Formats:** JPG, PNG, WEBP, GIF
- **Max files:** 10 photos per listing
- **Max size:** 10MB per photo
- **Recommended:** High-quality images showing rooms, amenities, and exterior

---

## 🧰 Tech Stack 

| Layer | Technology |
|-------|-------------|
| **Backend** | Spring Boot (Java 17) |
| **Web Frontend** | React + Vite |
| **Mobile App** | Android (Kotlin) |
| **Database** | PostgreSQL (Supabase) |
| **File Storage** | Supabase Storage |
| **Maps Integration** | Leaflet / OpenStreetMap |
| **Authentication** | JWT + Google OAuth2 |
| **Hosting** | Render (Backend + Frontend) |

---

## ⚙️ Local Development Setup

### 🧩 1. Clone the Repository
```bash
git clone https://github.com/avid0101/BoardingHouseFinderForStudents-IT342-G01-Group4.git
cd BoardingHouseFinderForStudents-IT342-G01-Group4
```

### 🖥️ 2. Backend (Spring Boot)

Navigate to the backend folder:
```bash
cd backend
```

You MUST CREATE application.properties file and Configure `src/main/resources/application.properties`:
- Set your MySQL database credentials
- Set your Google OAuth2 credentials
- Set your JWT secret key

Run the backend:
```bash
./mvnw spring-boot:run
```

The backend will start at `http://localhost:8080`

### 💻 3. Web Frontend (React)

Navigate to the web folder:
```bash
cd web
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Install dependencies and run:
```bash
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

### 📱 4. Mobile App (Android)

Open the `mobile` folder in Android Studio and run on an emulator or device.

---

## 🚀 Production Deployment (Render + Supabase)

### Prerequisites
1. A [Render](https://render.com) account
2. A [Supabase](https://supabase.com) project with PostgreSQL database
3. Google OAuth2 credentials configured for your production domain

### Step 1: Set Up Supabase

#### Database:
1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to **Settings > Database** and copy the connection string
3. The format should be: `jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?user=postgres.jsaeurafjxxsyzxdbtrn&password=[YOUR PASSWORD]`

#### Storage (for photos):
1. Go to **Storage** in Supabase Dashboard
2. Create a new bucket called `listing-images`
3. Set it as **Public**
4. Add a policy to allow uploads:
   - Policy name: `Allow public access`
   - Operations: SELECT, INSERT, UPDATE, DELETE
   - Policy definition: `bucket_id = 'listing-images'`

### Step 2: Deploy to Render

**Backend Service:**
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your Supabase PostgreSQL connection string |
| `JWT_SECRET` | A secure secret key for JWT tokens |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
| `FRONTEND_URL` | `https://boardinghouse-web.onrender.com` |
| `BACKEND_URL` | `https://boardinghouse-api-uc53.onrender.com` |
| `SPRING_PROFILES_ACTIVE` | `production` |

**Frontend Service:**
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | `https://boardinghouse-api-uc53.onrender.com` |
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### Step 3: Configure Google OAuth

Update your Google Cloud Console OAuth credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services > Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add your production URLs:
   - **Authorized JavaScript origins:** `https://boardinghouse-web.onrender.com`
   - **Authorized redirect URIs:** `https://boardinghouse-api-uc53.onrender.com/login/oauth2/code/google`

---

## 📋 User Roles

| Role | Capabilities |
|------|--------------|
| **Student** | Browse listings, search with filters, contact landlords, save favorites |
| **Landlord** | Create/edit/delete listings, upload photos, respond to inquiries |
| **Admin** | Approve/reject listings, manage users, system oversight |

---

## 👥 Team Members

- **Justin Andry Diva** — Developer — justinandry.diva@cit.edu — [@avid0101](https://github.com/avid0101)  
- **Juvie Coca** — Developer — juvie.coca@cit.edu — [@Juvie-cmd](https://github.com/Juvie-cmd)  
- **Ken Daniel E. Cortes** — Developer — kendaniel.cortes@cit.edu — [@knkncrts1](https://github.com/knkncrts1)  
- **E.J Boy Gabriel S. Flores** — Developer — ejboygabriel.flores@cit.edu — [@floresejboy](https://github.com/floresejboy)

---

## 📄 License

This project is for educational purposes as part of IT342 course.
