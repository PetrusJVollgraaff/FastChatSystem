import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './Login/Login';
import RegisterPage from "./Register/Register"

type Props = {}

export default function FrontPage({}: Props) {
  return (
    <BrowserRouter>
        <nav className="main_nav">
            <ul>
                <li><Link to="/">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </nav>
        <Routes>
            <Route path="/" element={<LoginPage />}/>
            <Route path="/register" element={<RegisterPage />}/>
        </Routes> 
    </BrowserRouter>
  )
}