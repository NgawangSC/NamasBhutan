"use client"

import { useState } from "react"
import "./DashboardLogin.css"

const DashboardLogin = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      })

      const data = await response.json()

      if (data.success) {
        // Store auth token and user info
        localStorage.setItem("dashboardAuth", "true")
        localStorage.setItem("authToken", data.data.token)
        localStorage.setItem("currentUser", JSON.stringify(data.data.user))
        setIsAuthenticated(true)
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      console.error('Login error:', error)
      setError("Unable to connect to server. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="dashboard-login">
      <div className="login-container">
        <div className="login-header">
          <h1>Dashboard Login</h1>
          <p>Sign in to manage your website</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="Enter password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-info">
          <p>Default credentials:</p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardLogin
