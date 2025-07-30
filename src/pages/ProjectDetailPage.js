"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import { getImageUrl } from "../utils/imageUtils"
import "./ProjectDetailPage.css"

const ProjectDetailPage = () => {
  const navigate = useNavigate()
  const { projects, loading, fetchProjects } = useData()
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)

  useEffect(() => {
    // Fetch projects on mount if not already loaded
    if (projects.length === 0 && !hasAttemptedFetch) {
      setHasAttemptedFetch(true)
      fetchProjects()
    }
  }, [projects.length, hasAttemptedFetch, fetchProjects])

  // Timeout mechanism to handle stuck loading state
  useEffect(() => {
    if (loading.projects) {
      const timeout = setTimeout(() => {
        fetchProjects()
      }, 10000) // 10 second timeout
      
      return () => clearTimeout(timeout)
    }
  }, [loading.projects, fetchProjects])

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`)
  }

  const handleRefresh = async () => {
    const btn = document.querySelector('.refresh-btn');
    const originalText = btn.textContent;
    
    try {
      btn.textContent = '⟳ Loading...';
      btn.disabled = true;
      await fetchProjects();
      
      // Show success indicator
      btn.textContent = '✓ Updated';
      btn.style.background = 'rgba(40, 167, 69, 0.8)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to refresh:', error);
      btn.textContent = '✗ Error';
      btn.style.background = 'rgba(220, 53, 69, 0.8)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    }
  }

  // Show loading only if we truly have no data and are actively loading
  if (loading.projects && projects.length === 0) {
    return (
      <div className="projects-loading">
        <div>Loading projects...</div>
        <button 
          onClick={() => {
            fetchProjects()
          }}
          style={{ marginTop: '10px', padding: '8px 16px' }}
        >
          Retry Loading
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="projects-loading">
        <h2>No projects found</h2>
        <p>There are no projects available at the moment.</p>
        <button onClick={() => navigate('/')} className="back-home-btn">
          Go Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="projects-gallery-page">
      <div className="projects-header">
        <h1>Our Projects</h1>
        <button 
          onClick={handleRefresh}
          className="refresh-btn"
          title="Refresh projects"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => {
          const projectImage = project.images && Array.isArray(project.images) && project.images.length > 0 
            ? getImageUrl(project.images[0])
            : project.image 
              ? getImageUrl(project.image) 
              : "/placeholder.svg"

          return (
            <div 
              key={project.id} 
              className="project-card"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="project-image-container">
                <img
                  src={projectImage}
                  alt={project.title}
                  className="project-image"
                  onError={(e) => {
                    console.warn('Project image failed to load:', projectImage);
                    e.target.src = "/placeholder.svg?height=300&width=400&text=Image+Not+Found";
                  }}
                />
                <div className="project-overlay">
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-category">{project.category}</p>
                    <div className="project-details">
                      <span className="project-location">{project.location}</span>
                      <span className="project-year">{project.year}</span>
                    </div>
                    <div className="project-status">
                      <span className={`status-badge ${project.status?.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {project.description && (
                <div className="project-description">
                  <p>{project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectDetailPage
