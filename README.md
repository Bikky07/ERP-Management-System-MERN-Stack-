ERP Management System (MERN Stack)

A full-stack ERP (Enterprise Resource Planning) web application built using the MERN stack.
This system helps businesses manage products, customers, suppliers, purchase orders, sales orders, inventory, GRN, and reports from a single dashboard.

📌 Project Overview

This ERP system is designed for a mid-sized company to manage its daily business operations digitally.

The application supports:

Role-based access (Admin, Sales, Purchase)

End-to-end inventory flow

Purchase → GRN → Stock Update

Sales → Stock Deduction

Centralized dashboard and reports

🚀 Features Implemented
🔐 Authentication & Authorization

Login with JWT authentication

Role-based access control

Admin

Sales

Purchase

📊 Dashboard

Total Products

Total Customers

Total Suppliers

Low Stock Alerts

Quick overview of system status

📦 Product Management

Add / View products

SKU & stock tracking

Stock auto-update via GRN & Sales

👥 Customer Management

Add customers

View customer list

Used in Sales Orders

🚚 Supplier Management

Add suppliers

View supplier list

Used in Purchase Orders

🧾 Purchase Orders (PO)

Create purchase orders

Select supplier

Add multiple products

View purchase order list

📥 GRN (Goods Receipt Note)

Link GRN with Purchase Order

Receive goods

Automatically increase product stock

Tracks received items

🛒 Sales Orders

Create sales orders

Select customer

Add multiple products

Automatically reduce product stock

📦 Inventory / Stock View

View real-time stock of all products

Auto-updated from GRN & Sales Orders

📈 Reports

Product stock report

Sales & purchase overview

Excel export supported

🛠️ Tech Stack
Frontend

React (Vite)

React Router DOM

Axios

CSS (custom)

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

📂 Project Structure
erp-system/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── layouts/
│   ├── api/
│   ├── styles/
│   └── App.jsx
│
└── README.md

▶️ How to Run the Project
1️⃣ Clone the Repository
git clone https://github.com/your-username/erp-system.git
cd erp-system

2️⃣ Backend Setup
cd backend
npm install


Create a .env file inside backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:

npm run dev


Backend runs on:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🔄 ERP Workflow Explained

Add Products

Create Purchase Order

Create GRN → Stock increases

Create Sales Order → Stock decreases

Inventory auto-updates

Dashboard & Reports reflect changes

✅ Project Status
Completed

Authentication & Roles

Dashboard

Products

Customers

Suppliers

Purchase Orders

GRN

Sales Orders

Inventory

Reports with Excel Export

Future Enhancements

Invoice generation (PDF)

Payment tracking

User activity logs

Advanced analytics

Mobile responsive UI

👨‍💻 Author

Bikky Kumar
ERP Management System – MERN Stack
Internship / Learning Project
