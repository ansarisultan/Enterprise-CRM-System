# Enterprise CRM System

A full-stack Customer Relationship Management (CRM) platform designed to streamline lead management, sales tracking, and customer engagement workflows.

## Overview

Enterprise CRM System is a web-based application that enables organizations to manage leads, monitor sales pipelines, and gain business insights through a centralized dashboard. The application provides a structured workflow for tracking prospects from initial contact to conversion.

## Key Features

### Authentication

* Secure user registration and login
* JWT-based authentication
* Protected application routes
* Password hashing using bcrypt

### Lead Management

* Create new leads
* View lead records
* Update lead information
* Delete leads
* Search leads by name

### Sales Pipeline

* New
* Contacted
* Qualified
* Won
* Lost

### Analytics Dashboard

* Total lead statistics
* Conversion tracking
* Lead status distribution
* Interactive data visualization

### Responsive Interface

* Desktop support
* Tablet support
* Mobile-friendly design

---

## Technology Stack

### Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios
* Chart.js

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JSON Web Token (JWT)
* bcryptjs

---

## System Architecture

```text
Client (React.js)
        │
        ▼
REST API (Express.js)
        │
        ▼
MongoDB Database
```

---

## Project Structure

```text
enterprise-crm-system/

├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## Data Models

### User

```javascript
{
  name: String,
  email: String,
  password: String
}
```

### Lead

```javascript
{
  name: String,
  email: String,
  phone: String,
  company: String,
  status: String
}
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Leads

```http
GET    /api/leads
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id
```

---

## Local Development

### Clone Repository

```bash
git clone https://github.com/your-username/enterprise-crm-system.git
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Screenshots

### Authentication

Add screenshot

### Dashboard

Add screenshot

### Lead Management

Add screenshot

### Analytics

Add screenshot

---

## Future Improvements

* Role-based access control
* Team collaboration features
* Activity history
* Email integration
* Export reports
* Advanced analytics
* Notification system

---

## Author

Sultan Salauddin Ansari

Computer Science Engineering Student

MERN Stack Developer

GitHub: https://github.com/ansarisultan

LinkedIn: https://linkedin.com/in/SultanSAnsari

---

## License

This project is provided for educational and demonstration purposes.
