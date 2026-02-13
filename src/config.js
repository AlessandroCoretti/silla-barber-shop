// Dynamically determine the API URL based on the current hostname
// This allows the app to work on localhost, 127.0.0.1, or any network IP (like 192.168.1.12)
// It also allows overriding via environment variable (useful for Vercel/Production)
const hostname = window.location.hostname;
export const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${hostname}:8081/api`;
