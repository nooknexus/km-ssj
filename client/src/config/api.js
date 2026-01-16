// API Configuration
// ใช้ environment variable หรือ default เป็น localhost:5001

export const API_URL = import.meta.env.VITE_API_URL || '';
export const API_BASE = `${API_URL}/api`;
