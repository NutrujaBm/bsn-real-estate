import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // URL ของ Backend Server
        changeOrigin: true, // เปลี่ยน origin ของ request ให้ตรงกับ target
        rewrite: (path) => path.replace(/^\/api/, ""), // (ไม่บังคับ) ลบ /api ออกจาก path
        secure: false, // ใช้ในกรณีที่ใช้ HTTPS และมี self-signed certificate
      },
    },
  },
  plugins: [react()],
});
