#                        🏠 Boarding House Finder for Students

## 📖 Project Description
The **Boarding House Finder for Students** is a web and mobile platform that helps students easily search for and connect with available boarding houses near their school. It simplifies the accommodation search process by offering a **centralized, verified, and location-based listing system** for both students and landlords.

Powered by **Supabase** as the backend service, the system provides **real-time data management**, **secure authentication**, and **cloud-hosted PostgreSQL storage**. The web and mobile interfaces are built to ensure a **seamless and responsive experience**, enabling users to:
- 🔍 **Search** for boarding houses by price, distance, room type, and amenities.
- 🏘️ **View listings** with Google Maps integration for precise location visibility.
- 🧑‍💼 **Landlords:** Post, edit, and manage their property listings.
- 🧑‍🎓 **Students:** Save, bookmark, and contact landlords directly through the app.

With its Supabase backend, React web frontend, and mobile app, the **Boarding House Finder for Students** delivers an **efficient, secure, and user-friendly** solution for the student housing community.

---

##                               🧰 Tech Stack 

| Layer | Technology |
|-------|-------------|
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Web Frontend** | ReactJS |
| **Mobile App** | React Native |
| **Database** | Supabase PostgreSQL |
| **Maps Integration** | Google Maps API |

---


---

##                          ⚙️ Setup & Run Instructions

> ℹ️ *Note: The following steps outline how the system will be set up once development begins.*

### 🧩 1. Clone the Repository
```bash
git clone https://github.com/Juvie-cmd/BoardingHouseFinderForStudents-IT342-G01-Group4.git
cd BoardingHouseFinderForStudents-IT342-G01-Group4


2. Backend (Supabase)

Go to https://supabase.com
 and create a new project.

Configure:

Authentication: Enable Email/Password sign-in.

Database: Create tables for users, listings, and bookmarks.

Storage: Enable bucket for listing images.

Retrieve your Project URL and Anon Key from the Supabase Dashboard.

💻 3. Web Frontend (React)

Navigate to the web folder:

cd web


Initialize the React project (will be added in later development):

npx create-react-app .


Create a .env file and add:

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key


Run the app:

npm install
npm run dev

📱 4. Mobile App (React Native)

Navigate to the mobile folder:

cd mobile


Initialize the app (future setup):

npx create-expo-app .


Add Supabase client configuration:

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


Run the mobile app:

npm install
npm start

##👥 Team Members

- **Justin Andry Diva** — Developer — justinandry.diva@cit.edu — [@avid0101](https://github.com/avid0101)  
- **Juvie Coca** — Developer — juvie.coca@cit.edu — [@Juvie-cmd](https://github.com/Juvie-cmd)  
- **Ken Daniel E. Cortes** — Developer — kendaniel.cortes@cit.edu — [@knkncrts1](https://github.com/knkncrts1)  
- **E.J Boy Gabriel S. Flores** — Developer — ejboygabriel.flores@cit.edu — [@floresejboy](https://github.com/floresejboy)






