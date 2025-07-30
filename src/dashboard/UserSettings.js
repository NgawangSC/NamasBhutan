"use client"

import { useState, useEffect } from "react"
import "./UserSettings.css"

const UserSettings = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [usernameForm, setUsernameForm] = useState({
    newUsername: "",
    password: ""
  })
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [isLoadingUsername, setIsLoadingUsername] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [usernameSuccess, setUsernameSuccess] = useState("")

  useEffect(() => {
    // Get current user from localStorage
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
    setPasswordError("")
    setPasswordSuccess("")
  }

  const handleUsernameChange = (e) => {
    const { name, value } = e.target
    setUsernameForm(prev => ({ ...prev, [name]: value }))
    setUsernameError("")
    setUsernameSuccess("")
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setIsLoadingPassword(true)
    setPasswordError("")
    setPasswordSuccess("")

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match")
      setIsLoadingPassword(false)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      setIsLoadingPassword(false)
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          username: currentUser?.username
        })
      })

      const data = await response.json()

      if (data.success) {
        setPasswordSuccess("Password changed successfully!")
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      } else {
        setPasswordError(data.error || "Failed to change password")
      }
    } catch (error) {
      console.error('Password change error:', error)
      setPasswordError("Unable to connect to server. Please try again.")
    }

    setIsLoadingPassword(false)
  }

  const handleUsernameSubmit = async (e) => {
    e.preventDefault()
    setIsLoadingUsername(true)
    setUsernameError("")
    setUsernameSuccess("")

    if (usernameForm.newUsername.length < 3) {
      setUsernameError("Username must be at least 3 characters long")
      setIsLoadingUsername(false)
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch('http://localhost:5000/api/auth/change-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentUsername: currentUser?.username,
          newUsername: usernameForm.newUsername,
          password: usernameForm.password
        })
      })

      const data = await response.json()

      if (data.success) {
        setUsernameSuccess("Username changed successfully!")
        // Update current user in localStorage
        const updatedUser = { ...currentUser, username: data.data.username }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setCurrentUser(updatedUser)
        setUsernameForm({
          newUsername: "",
          password: ""
        })
      } else {
        setUsernameError(data.error || "Failed to change username")
      }
    } catch (error) {
      console.error('Username change error:', error)
      setUsernameError("Unable to connect to server. Please try again.")
    }

    setIsLoadingUsername(false)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="user-settings">
      <div className="user-settings-header">
        <h1>User Settings</h1>
        <p>Manage your account credentials</p>
      </div>

      <div className="settings-section">
        <div className="current-user-info">
          <h2>Current User Information</h2>
          <div className="user-info-item">
            <label>Username:</label>
            <span>{currentUser.username}</span>
          </div>
          <div className="user-info-item">
            <label>Role:</label>
            <span>{currentUser.role}</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Confirm new password"
            />
          </div>

          {passwordError && <div className="error-message">{passwordError}</div>}
          {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}

          <button type="submit" className="settings-btn" disabled={isLoadingPassword}>
            {isLoadingPassword ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>

      <div className="settings-section">
        <h2>Change Username</h2>
        <form onSubmit={handleUsernameSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="newUsername">New Username</label>
            <input
              type="text"
              id="newUsername"
              name="newUsername"
              value={usernameForm.newUsername}
              onChange={handleUsernameChange}
              required
              placeholder="Enter new username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={usernameForm.password}
              onChange={handleUsernameChange}
              required
              placeholder="Enter your password to confirm"
            />
          </div>

          {usernameError && <div className="error-message">{usernameError}</div>}
          {usernameSuccess && <div className="success-message">{usernameSuccess}</div>}

          <button type="submit" className="settings-btn" disabled={isLoadingUsername}>
            {isLoadingUsername ? "Changing Username..." : "Change Username"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserSettings