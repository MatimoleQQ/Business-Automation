# 🚀 Business Automation Platform

A production-style full-stack SaaS application for automated CSV processing, analytics, and PDF report generation.

The system allows users to upload datasets, automatically process and analyze data quality, generate structured reports, and download results as PDF or CSV through a secure dashboard.

Built to simulate a real-world data automation pipeline used in business analytics platforms.

---

## 🔗 Live Demo

Frontend:
https://business-automation-pink-two.vercel.app/

Backend API:
https://business-automation-px4u.onrender.com/

---

## 🔑 Test Account

For quick access:

```
Email: test@test.com
Password: 1234
```

---

## ✨ Key Features

### 🔐 Authentication System

* JWT-based authentication
* Secure login / register flow
* Protected routes (frontend + backend)
* Password hashing (bcrypt)

---

### 📊 Data Processing Pipeline

* CSV file upload
* Automated dataset analysis
* Missing values detection
* Dataset statistics generation
* Background processing (FastAPI BackgroundTasks)

---

### 📄 Report Generation System

* Automatic PDF report generation
* CSV export support
* Timestamped reports
* Structured analytics output

---

### 📥 File Management

* Secure PDF download (JWT protected)
* Secure CSV download
* PDF preview in browser
* File ownership per user

---

### 📊 Analytics Dashboard

* Interactive charts (Recharts)
* Dataset overview metrics
* Data quality scoring
* Report history management
* Report status tracking

---

### 🎨 UI / UX

* Modern dark dashboard UI
* Loading skeletons
* Error & empty states
* Responsive layout
* Smooth animations (Framer Motion)

---

## ⚙️ Architecture Overview

### Backend (FastAPI)

Responsible for:

* Authentication (JWT)
* File processing pipeline
* Report generation (PDF/CSV)
* Database operations
* Background task execution

---

### Frontend (React)

Responsible for:

* UI rendering
* Routing
* Authentication state handling
* Dashboard visualization
* File downloads & preview

---

### Data Flow

```
CSV Upload
   ↓
Backend validation
   ↓
Data analysis (stats + insights)
   ↓
Background report generation
   ↓
PDF + CSV stored on server
   ↓
User downloads / previews results
```

---

## 🧠 Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Framer Motion
* Recharts

### Backend

* FastAPI
* SQLAlchemy
* JWT Authentication
* FastAPI BackgroundTasks
* ReportLab (PDF generation)

### Database

* PostgreSQL

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 🗂️ Project Structure

```
business-automation/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── routes/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── auth/
│   │   ├── models/
│   │   └── database/
│
└── reports/
```

---

## 📡 API Endpoints

### Auth

```
POST /api/auth/register
POST /api/auth/login
```

### Reports

```
GET  /api/reports
GET  /api/reports/{id}
GET  /api/reports/{id}/download
GET  /api/reports/{id}/download-csv
```

### Upload

```
POST /api/upload
```

---

## 📸 Screenshots

> Add screenshots here (VERY recommended)

* Dashboard view
* Report details page
* Upload flow

---

## 🚀 What This Project Demonstrates

This project was built to showcase:

* Full-stack application design
* Authentication & authorization systems
* File processing pipelines
* Background task execution
* REST API design
* Frontend state management
* Data visualization
* Production deployment workflow

---

## 🔮 Future Improvements

* User roles (admin / user)
* Cloud storage (S3 / Cloudinary)
* Email notifications
* Report sharing system
* Advanced analytics module
* Queue-based processing (Celery / Redis)

---

## 👤 Author

**Marcin Witański**

GitHub: https://github.com/MatimoleQQ
