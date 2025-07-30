"use client"

import { useState } from "react"
import { useData } from "../contexts/DataContext"
import { getImageUrl } from "../utils/imageUtils"
import "./TeamManager.css"

const TeamManager = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    position: "",
    bio: "",
    email: "",
    linkedin: "",
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
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData)
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
      linkedin: "",
      image: null,
    })
    setShowForm(false)
    setEditingMember(null)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name || "",
      title: member.title || "",
      position: member.position || "",
      bio: member.bio || "",
      email: member.email || "",
      linkedin: member.linkedin || "",
      image: null,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteTeamMember(id)
      } catch (error) {
        console.error('Error deleting team member:', error)
        alert('Error deleting team member: ' + error.message)
      }
    }
  }

  return (
    <div className="team-manager">
      <div className="manager-header">
        <h1>Team Members</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Team Member
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h2>{editingMember ? "Edit Team Member" : "Add New Team Member"}</h2>
              <button
                className="btn btn-close"
                onClick={resetForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="team-form">
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Founder, Senior Architect"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="position">Position *</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="e.g., Principal Architect, Project Manager"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Brief biography of the team member..."
                />
              </div>

              <div className="form-row">
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
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">Profile Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {editingMember && editingMember.image && (
                  <div className="current-image">
                    <p>Current image:</p>
                    <img 
                      src={getImageUrl(editingMember.image)} 
                      alt={editingMember.name}
                      className="preview-image"
                    />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="team-grid">
        {teamMembers && teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-image">
                <img
                  src={getImageUrl(member.image) || "/placeholder-avatar.svg"}
                  alt={member.name}
                  onError={(e) => {
                    e.target.src = "/placeholder-avatar.svg"
                  }}
                />
              </div>
              
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="team-title">{member.title}</p>
                <p className="team-position">{member.position}</p>
                
                {member.bio && (
                  <p className="team-bio">{member.bio.substring(0, 100)}...</p>
                )}
                
                <div className="team-contact">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="contact-link">
                      📧 Email
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                      💼 LinkedIn
                    </a>
                  )}
                </div>
              </div>

              <div className="team-actions">
                <button
                  onClick={() => handleEdit(member)}
                  className="btn btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-members">
            <p>No team members found.</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Your First Team Member
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamManager