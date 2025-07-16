import axios from 'axios'
import dataUtils from './data.js'

const service = axios.create({
  baseURL: 'http://localhost:3451', // api的base_url
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  const token = dataUtils.get('token', '')
  config.headers["Content-Type"] = "application/json";
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  return Promise.reject(error);
})

export default service