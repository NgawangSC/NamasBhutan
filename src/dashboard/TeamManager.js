"use client"

import { useState } from "react"
import { useData } from "../contexts/DataContext"
import { getImageUrl } from "../utils/imageUtils"
import "./TeamManager.css"

const TeamManager = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingTeamMember, setEditingTeamMember] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    position: "",
    bio: "",
    email: "",
    phone: "",
    status: "Active",
    image: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files && e.target.files.length > 0 ? e.target.files[0] : null,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingTeamMember) {
        await updateTeamMember(editingTeamMember.id, formData)
      } else {
        await addTeamMember(formData)
      }
      resetForm()
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Error saving team member: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      position: "",
      bio: "",
      email: "",
      phone: "",
      status: "Active",
      image: null,
    })
    setEditingTeamMember(null)
    setShowForm(false)
  }

  const handleEdit = (teamMember) => {
    setEditingTeamMember(teamMember)
    setFormData({
      name: teamMember.name,
      title: teamMember.title || "",
      position: teamMember.position || "",
      bio: teamMember.bio || "",
      email: teamMember.email || "",
      phone: teamMember.phone || "",
      status: teamMember.status || "Active",
      image: null, // Reset file input for editing
    })
    setShowForm(true)
  }

  const handleDelete = async (teamMemberId) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteTeamMember(teamMemberId)
      } catch (error) {
        console.error('Error deleting team member:', error)
        alert('Error deleting team member: ' + error.message)
      }
    }
  }

  const statuses = ["Active", "Inactive"]

  // Sort team members by creation date (most recent first)
  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.updatedAt || 0)
    const dateB = new Date(b.createdAt || b.updatedAt || 0)
    return dateB - dateA
  })

  return (
    <div className="team-manager">
      <div className="manager-header">
        <h2>Team Members</h2>
        <button 
          className="add-btn" 
          onClick={() => setShowForm(true)}
        >
          Add Team Member
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingTeamMember ? "Edit Team Member" : "Add New Team Member"}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="team-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Founder, Senior Architect"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="e.g., Principal Architect, Project Manager"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+975-12345678"
                  />
                </div>



                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="image">Profile Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small>Upload a professional headshot (JPG, PNG, WebP)</small>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Brief professional biography..."
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingTeamMember ? "Update Team Member" : "Add Team Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="team-grid">
        {sortedTeamMembers.length === 0 ? (
          <div className="no-team-members">
            <p>No team members found. Add your first team member to get started.</p>
          </div>
        ) : (
          sortedTeamMembers.map((teamMember) => (
            <div key={teamMember.id} className="team-card">
              <div className="team-image">
                <img 
                  src={getImageUrl(teamMember.image)} 
                  alt={teamMember.name}
                  onError={(e) => {
                    e.target.src = "/images/placeholder-avatar.png"
                  }}
                />
              </div>
              
                              <div className="team-info">
                  <h3 className="team-name">{teamMember.name}</h3>
                  {teamMember.title && <p className="team-title">{teamMember.title}</p>}
                  {teamMember.position && <p className="team-position">{teamMember.position}</p>}
                </div>

              <div className="team-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => handleEdit(teamMember)}
                  title="Edit team member"
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(teamMember.id)}
                  title="Delete team member"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TeamManager