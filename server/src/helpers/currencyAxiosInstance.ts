import axios, { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: `http://data.fixer.io/api/latest?access_key=${process.env.CURRENCY_API}`,
  headers: {
    'content-type': 'application/json'
  }
})

export default instance
