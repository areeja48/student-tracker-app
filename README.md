# 🎓 Student Tracker App A full-featured student tracking web application built with **Next.js (App Router)**, **MongoDB**, and **NextAuth.js**. The app includes authentication, CRUD management of courses, assignments, and activities, and a dashboard with interactive visualizations of progress and deadlines. --- ## 🚀 Live Demo > (https://student-tracker-taupe.vercel.app/) ---
## 📦 Features ### 
🔐 Authentication - Login & Register using 
**NextAuth.js (credentials provider)**
- Secure password hashing & session management
- - Protected routes with session-base access control
- - Forgot Password & Reset Password functionality with token
### 📊 Dashboard 
- Personalized dashboard showing:
- - User's **account details** - 
**Course progress** (bar chart)
- **Assignment stats** (pie chart)
- - **Activity stats** (donut chart)
- - Data visualizations powered by **Chart.js** 
### 📅 Calendar Integration 
- View upcoming **assignments** and **activities**
- - Integrated with **FullCalendar**
  - - CRUD items appear in real-time
    - - Uses **Flatpickr** for selecting due dates in forms
### 🧠 Management Panels (CRUD) Manage your academic data with full CRUD operations: 
- **Courses**
-  - **Assignments**
   - - **Activities**
     -  Each item links to its:
     -  - Create
        - - Read (details)
          - - Update
            - - Delete pages 
### 💻 Layout & UI 
- Global **dark/light mode** toggle with persistent theme - Sidebar navigation (Dashboard, Courses, Assignments, Activities, Progress)
- - Header displaying user’s name, email, and logout button - 
###Tailwind CSS for modern UI styling --- 
## 🧰 Tech Stack | Technology | Description | |-----------------|------------------------------------| |
**Next.js 15** | App Router + Server/Client support | | 
**MongoDB Atlas** | Cloud database for all data | | 
**NextAuth.js** | Authentication | | 
**Tailwind CSS**| Styling | | 
**Chart.js** | Charts (bar, pie, donut) | | 
**FullCalendar**| Calendar view for deadlines | |
**Flatpickr** | Date/time pickers in forms | | 
**TypeScript** | Type safety | --- 
## 🔐 Protected Routes All dashboard-related pages are protected: | Route | Description | |---------------------------|--------------------------------------| | 
/dashboard | Overview and stats | |
/dashboard/courses | Manage courses (CRUD) | | 
/dashboard/assignments | Manage assignments (CRUD) | | 
/dashboard/activities | Manage activities (CRUD) | | 
/dashboard/progress | View progress charts | | 
/dashboard/calendar | Calendar view of due dates | ---
## 📂 Project Structure student-tracker-app/ 
├── app/ │ 
├── auth/ │ 
├── dashboard/ │ │ 
├── layout.tsx # Sidebar + Header │ │ └── ... │ 
├── api/ # API routes (MongoDB) │ └── layout.tsx 
├── components/ │ ├── Sidebar.tsx │ ├── Header.tsx │ ├── ThemeContext.tsx │ 
└── charts/ 
├── lib/ │ └── mongodb.ts # DB connection helper 
├── public/ 
├── styles/ │ 
└── globals.css 
├── .env.local 
└── next.config.js

## ⚙️ Environment Variables Create a .env.local file in the project root:
env

# MongoDB
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# Email for password reset (if applicable)
EMAIL_SERVER=smtp://...
EMAIL_FROM=noreply@yourapp.com

🧑‍💻 Getting Started

# 1. Clone the repo
git clone https://github.com/areeja48/student-tracker-app.git
cd student-tracker-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
⚠️ Make sure MongoDB is connected via the .env.local file.

🧪 Production Build

npm run build
npm start
🚀 Deployment (Recommended: Vercel)
Push code to GitHub

Go to https://vercel.com

Import your GitHub repo

Set environment variables in the dashboard

Deploy 🎉

🧮 Charts & Visualizations
Chart Type	Data Source
Bar Chart	Course progress
Pie Chart	Assignment count
Donut Chart	Activity count

Data is fetched from MongoDB and rendered using Chart.js in the /dashboard/progress route.

📅 Calendar & Scheduling
View upcoming assignments and activities

Calendar powered by FullCalendar

Due dates selected via Flatpickr

Auto-updates from MongoDB collection

🌙 Dark Mode
Toggle available on all pages

Theme state stored in context + local storage

Fully styled with Tailwind's dark mode classes

🙋‍♂️ Author & Contact
Built by Areeja Amjad

GitHub: @areeja48

Email: honor12pakistan@gmail.com
