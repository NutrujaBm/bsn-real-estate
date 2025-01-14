# BSN Real Estate
BSN Real Estate เป็นโปรเจกต์ที่เกี่ยวข้องกับการปล่อยเช่าห้องพักคอนโดและอพาร์ทเม้นท์ โดยมีทั้งฝั่งของผู้ใช้งานและฝั่งของผู้ดูแลระบบ ใน README นี้จะอธิบายวิธีการติดตั้งและการใช้งานโปรเจกต์นี้

## คุณสมบัติที่ต้องเตรียม
1. **Node.js** (เวอร์ชัน 14.x หรือใหม่กว่า)
2. **npm** (ติดตั้งมาพร้อมกับ Node.js)
3. **Git**
4. **MongoDB** (หาก backend ใช้งานฐานข้อมูลนี้)

---

## การติดตั้ง
### ติดตั้ง Dependencies
#### Backend (api)
1. รันคำสั่งเพื่อติดตั้ง Dependencies
    ```bash
    npm install
    ```

#### Frontend (client)
1. เข้าไปที่โฟลเดอร์ `client`
    ```bash
    cd client
    ```
2. รันคำสั่งเพื่อติดตั้ง Dependencies
    ```bash
    npm install
    ```

---

### การตั้งค่าไฟล์ .env
#### Backend
1. สร้างไฟล์ `.env` ในโฟลเดอร์ `api`
2. เพิ่มค่าตัวแปรดังนี้:
    ```env
    MONGODB_URI=<ลิงก์ MongoDB ของคุณ>
    JWT_SECRET=<คีย์ลับ>
    ```

#### Frontend
1. สร้างไฟล์ `.env` ในโฟลเดอร์ `client`
2. เพิ่มค่าตัวแปรดังนี้:
    ```env
    VITE_FIREBASE_API_KEY=<คีย์ Firebase ของคุณ>
    VITE_GOOGLE_MAPS_API_KEY=<คีย์ Google Maps ของคุณ>
    ```

---

## การรันโปรเจกต์
### รัน Backend
1. รันเซิร์ฟเวอร์ `api` (จากโฟลเดอร์ `api` หรือ root)
    ```bash
    npm run dev
    ```

### รัน Frontend
1. เข้าไปที่โฟลเดอร์ `client`
    ```bash
    cd client
    ```
2. รันเซิร์ฟเวอร์
    ```bash
    npm run dev
    ```

---

## หมายเหตุ
- ควรตรวจสอบว่า MongoDB และ Firebase พร้อมใช้งานก่อนเริ่มรันโปรเจกต์
- ใช้คีย์ API และค่า Environment อย่างระมัดระวังเพื่อความปลอดภัย
