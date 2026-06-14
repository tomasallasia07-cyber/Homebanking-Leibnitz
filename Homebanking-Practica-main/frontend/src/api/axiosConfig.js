import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "x-environment": import.meta.env.VITE_API_ENV,
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

const db = axios.create({
  baseURL: 'http://localhost:3000'
})

export default {api, db};