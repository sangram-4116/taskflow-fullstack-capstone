import axios from 'axios';

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0'
    : 'https://onrender.com';
