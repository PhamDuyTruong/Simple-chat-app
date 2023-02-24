import { useState } from 'react'
import './App.css'
import axios from 'axios'
import RegisterAndLoginForm from './RegisterAndLoginForm'

function App() {
  axios.defaults.baseURL = "http://localhost:4000"
  axios.defaults.withCredentials = true;
  return (
    <div className="container">
      <RegisterAndLoginForm />
    </div>
  )
}

export default App
