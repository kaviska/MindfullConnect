# MindfulConnect

![Built With Next.js](https://img.shields.io/badge/Built%20with-Next.js-000?logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)
![Zoom](https://img.shields.io/badge/Video-Zoom-2D8CFF?logo=zoom&logoColor=white)

Mindful Connect is a modern web-based counseling platform that bridges the gap between clients and mental health professionals. Built with performance, privacy, and scalability in mind, it offers secure video conferencing, appointment scheduling, journaling, and streamlined payment processing — all under one intuitive interface.

---

## 📌 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)

---

## About

Mindful Connect empowers individuals to seek mental health support through a secure and user-friendly platform. With integrated Zoom video conferencing, Stripe-powered payments, and role-based access control, it provides a seamless experience for clients, counselors, and administrators alike.

---

## Features

- 🔐 **Secure Authentication & Authorization**  
  Role-based access for Admins, Counselors, and Clients with protected routes.

- 💬 **Rich Text Editor (TipTap)**  
  Journal entries and communication using a dynamic, modern editor.

- 🎥 **Zoom Integration**  
  In-app video sessions with counselors using Zoom REST API and SDK.

- 💳 **Stripe Payment Gateway**  
  Secure and reliable payment system for booking counseling sessions.

- 🖥️ **Admin Dashboard**  
  Manage users, monitor sessions, handle reports, and view platform analytics.

- 🌍 **Fully Responsive Design**  
  Optimized for desktop, tablet, and mobile.

---

## Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | Next.js (React)   |
| Backend     | Node.js, Express  |
| Database    | MongoDB (Mongoose)|
| Video API   | Zoom REST API & SDK |
| Payments    | Stripe            |
| Editor      | TipTap (ProseMirror) |
| Auth        | JWT, Role-Based Access Control (RBAC) |

---

## Setup Instructions

> Before you begin, ensure you have Node.js, MongoDB, and Git installed on your system.

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/mindful-connect.git
cd mindful-connect
