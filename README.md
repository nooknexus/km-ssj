# KM Health - Knowledge Management System

ระบบจัดการองค์ความรู้สุขภาพ (Knowledge Management System) - สำนักงานสาธารณสุขจังหวัดพิษณุโลก

พัฒนาด้วย **MERN Stack** (MySQL, Express, React, Node.js) + Vite

## 🚀 Features

- **Knowledge Base**: จัดการบทความ ข่าวสาร และไฟล์ดาวน์โหลด แบ่งตามหมวดหมู่
- **SSO Integration**: รองรับการเข้าสู่ระบบผ่าน **Health ID** (OAuth2)
- **User Management**: ระบบจัดการผู้ใช้งาน, อนุมัติสมาชิกใหม่ (Pending Approval), เปลี่ยนบทบาท (Admin/User)
- **Interactive UI**: หน้าบ้านทันสมัย รองรับ Responsive, Admin Panel แบบ Dashboard
- **Security**: JWT Authentication, Role-based Access Control (RBAC)

## 📁 Project Structure

- `client/`: Frontend Application (React + Vite + TailwindCSS)
- `server/`: Backend API (Node.js + Express + MySQL)
- `DEPLOY.md`: คู่มือการ Deployment (Production & LAN)

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Axios, Lucide React, Framer Motion
- **Backend**: Node.js, Express, MySQL2, JSON Web Token (JWT)
- **Authentication**: Custom Auth + Health ID Provider (SSO)

## 🏁 Getting Started

ดูรายละเอียดการติดตั้งและรันในโฟลเดอร์ย่อย:
- [Client Documentation](client/README.md)
- [Server Documentation](server/README.md)

## 📦 Deployment

ดูคู่มือการนำขึ้น Server จริงที่ [DEPLOY.md](DEPLOY.md)

---
Developed by [NookNexus](https://github.com/nooknexus)
