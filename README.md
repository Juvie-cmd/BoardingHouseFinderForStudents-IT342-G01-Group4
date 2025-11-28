# 🏠 Boarding House Finder for Students

## 📖 Project Description
The **Boarding House Finder for Students** is a web and mobile platform that helps students easily search for and connect with available boarding houses near their school. It simplifies the accommodation search process by offering a **centralized, verified, and location-based listing system** for both students and landlords.

The system provides **real-time data management**, **secure authentication**, and **cloud-hosted PostgreSQL storage**. The web and mobile interfaces are built to ensure a **seamless and responsive experience**, enabling users to:
- 🔍 **Search** for boarding houses by price, distance, room type, and amenities.
- 🏘️ **View listings** with map integration for precise location visibility.
- 🧑‍💼 **Landlords:** Post, edit, and manage their property listings.
- 🧑‍💼 **Administrator:** System management, user oversight, and content moderation.
- 🧑‍🎓 **Students:** Save, bookmark, and contact landlords directly through the app.

---

## 🧰 Tech Stack 

| Layer | Technology |
|-------|-------------|
| **Backend** | Spring Boot (Java 17) |
| **Web Frontend** | React + Vite |
| **Mobile App** | Android (Kotlin) |
| **Database** | PostgreSQL (Supabase) / MySQL (local) |
| **Maps Integration** | Leaflet / OpenStreetMap |
| **Authentication** | JWT + Google OAuth2 |

---

## ⚙️ Local Development Setup

### 🧩 1. Clone the Repository
```bash
git clone https://github.com/Juvie-cmd/BoardingHouseFinderForStudents-IT342-G01-Group4.git
cd BoardingHouseFinderForStudents-IT342-G01-Group4
```

### 🖥️ 2. Backend (Spring Boot)

Navigate to the backend folder:
```bash
cd backend
```

Configure `src/main/resources/application.properties`:
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

Create a `.env` file (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:8080
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

### Step 1: Set Up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to **Settings > Database** and copy the connection string
3. The format should be: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

### Step 2: Deploy to Render

#### Option A: Using render.yaml (Blueprint)

1. Fork this repository
2. Go to Render Dashboard > **New** > **Blueprint**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` and set up both services
5. Configure the following environment variables:

**Backend Service (`boardinghouse-api`):**
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your Supabase PostgreSQL connection string |
| `JWT_SECRET` | Auto-generated or set your own secure key |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
| `FRONTEND_URL` | Your frontend URL (e.g., `https://boardinghouse-web.onrender.com`) |
| `BACKEND_URL` | Your backend URL (e.g., `https://boardinghouse-api.onrender.com`) |

**Frontend Service (`boardinghouse-web`):**
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your backend URL (e.g., `https://boardinghouse-api.onrender.com`) |

#### Option B: Manual Deployment

**Deploy Backend:**
1. Go to Render Dashboard > **New** > **Web Service**
2. Connect your GitHub repository
3. Set the following:
   - **Root Directory:** `backend`
   - **Runtime:** Docker
   - **Environment:** Set variables as listed above

**Deploy Frontend:**
1. Go to Render Dashboard > **New** > **Static Site**
2. Connect your GitHub repository  
3. Set the following:
   - **Root Directory:** `web`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:** Set `VITE_API_URL`

### Step 3: Configure Google OAuth

Update your Google Cloud Console OAuth credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services > Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add your production URLs:
   - **Authorized JavaScript origins:** `https://your-frontend.onrender.com`
   - **Authorized redirect URIs:** `https://your-backend.onrender.com/login/oauth2/code/google`

---

## 👥 Team Members

- **Justin Andry Diva** — Developer — justinandry.diva@cit.edu — [@avid0101](https://github.com/avid0101)  
- **Juvie Coca** — Developer — juvie.coca@cit.edu — [@Juvie-cmd](https://github.com/Juvie-cmd)  
- **Ken Daniel E. Cortes** — Developer — kendaniel.cortes@cit.edu — [@knkncrts1](https://github.com/knkncrts1)  
- **E.J Boy Gabriel S. Flores** — Developer — ejboygabriel.flores@cit.edu — [@floresejboy](https://github.com/floresejboy)

---

## 📄 License

This project is for educational purposes as part of IT342 course.






