# 🎓 Student Tracker App

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://student-tracker-taupe.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)


A **full-featured student tracking web app** using **Next.js (App Router)**, **MongoDB**, **NextAuth.js**, and modern libraries like **Chart.js**, **FullCalendar**, and **Flatpickr** for productivity-focused academic tracking.

> 🚀 [Live Demo](https://student-tracker-taupe.vercel.app)

---

## 📦 Features

<details>
<summary><strong>🔐 Authentication</strong></summary>

- NextAuth.js (Credentials Provider)
- Secure password hashing
- Protected routes via sessions
- Forgot/Reset password via token

</details>

<details>
<summary><strong>📊 Interactive Dashboard</strong></summary>

- View course progress (Bar chart)
- Assignment stats (Pie chart)
- Activity stats (Donut chart)
- Chart.js powered visuals

</details>

<details>
<summary><strong>📅 Calendar Integration</strong></summary>

- View due dates for assignments/activities
- Real-time sync with MongoDB
- Flatpickr for form date pickers

</details>

<details>
<summary><strong>🧠 Academic Management (CRUD)</strong></summary>

- Courses
- Assignments
- Activities
- Each has Create, Read, Update, Delete operations

</details>

<details>
<summary><strong>💻 UI/UX</strong></summary>

- Responsive sidebar and header
- Dark/Light theme toggle (saved in localStorage)
- Clean layout with Tailwind CSS

</details>

---

## 🧰 Tech Stack

| Tech            | Description                              |
|-----------------|------------------------------------------|
| **Next.js 15**  | App Router, SSR & Client support         |
| **MongoDB Atlas** | Cloud DB for storing user data         |
| **NextAuth.js** | Authentication system                    |
| **Tailwind CSS**| Utility-first styling                    |
| **Chart.js**    | Charts for data visualization            |
| **FullCalendar**| Interactive calendar for tasks           |
| **Flatpickr**   | Lightweight date/time picker             |
| **TypeScript**  | Type safety throughout the app           |

---

## 🔐 Protected Routes

All dashboard-related routes are **fully protected** via session-based auth.

| Route                       | Description                    |
|----------------------------|--------------------------------|
| `/dashboard`               | User overview                  |
| `/dashboard/courses`       | Course management              |
| `/dashboard/assignments`   | Assignment management          |
| `/dashboard/activities`    | Activity tracking              |
| `/dashboard/progress`      | Visual progress stats          |
| `/dashboard/calendar`      | Calendar with due dates        |

---

## 🗂️ Project Structure

student-tracker-app/
├── app/
│ ├── auth/
│ ├── dashboard/
│ │ └── layout.tsx # Sidebar + Header
|   
├── api/ # MongoDB API routes
├── components/
│ ├── Sidebar.tsx
│ ├── Header.tsx
│ ├── ThemeContext.tsx 
│ ├── AssignmentCalendar.tsx
│ ├── ActivityCalendar.tsx
│ ├── ChartSection.tsx
| ├── Loader.tsx
├── lib/
│ └── mongodb.ts # DB connector
| └── auth.ts
| └── sendEmail.ts
├── public/
├──
│ └── globals.css
├── .env.local
├── next.config.js

---

## ⚙️ Setup & Configuration

### 🛠️ Environment Variables

Create a `.env.local` file:

```env
bash
Copy code
# MongoDB
MONGODB_URI=mongodb+srv://<your-cluster>

# NextAuth
NEXTAUTH_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# Optional: SMTP for password reset
EMAIL_USER=....
EMAIL_PASS=....
🧑‍💻 Getting Started
bash
Copy code
# 1. Clone the repository
git clone https://github.com/areeja48/student-tracker-app.git
cd student-tracker-app

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
⚠️ Ensure MongoDB is connected via .env.local

🧪 Production
bash

# Build for production
npm run build

# Start production server
npm start
🚀 Deploying to Vercel
Push your code to GitHub

Visit vercel.com

Import your repo and set environment variables

Click Deploy 🎉

📈 Charts & Visualizations
Chart	Description
Bar Chart	Course progress
Pie Chart	Assignment distribution
Donut Chart	Activity overview

Charts use real-time data from MongoDB and render via Chart.js in /dashboard/progress.

📅 Calendar Features
Powered by FullCalendar

Add/edit/delete assignments & activities

Date selection via Flatpickr

Calendar auto-refreshes from MongoDB

🌙 Dark Mode Support
Toggle in the header

Uses React context + localStorage

Fully styled via Tailwind's dark mode classes


🙋‍♀️ Author
Built with ❤️ by Areeja Amjad

GitHub: @areeja48

Email: honor12pakistan@gmail.com