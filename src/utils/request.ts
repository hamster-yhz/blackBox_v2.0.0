import axios from 'axios'

// Create axios instance with custom config
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
request.interceptors.request.use(
  config => {
    // You can add custom headers, auth tokens, etc. here
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
request.interceptors.response.use(
  response => {
    // You can transform response data here if needed
    return response
  },
  error => {
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default request 