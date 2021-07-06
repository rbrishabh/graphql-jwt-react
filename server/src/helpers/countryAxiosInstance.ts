import axios, { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: 'https://restcountries.eu/rest/v2/',
  headers: {
    'content-type': 'application/json'
  }
})

export default instance
