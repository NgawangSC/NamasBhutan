"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import { getImageUrl } from "../utils/imageUtils"
import "./ProjectDetailPage.css"

const ProjectDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, loading, fetchProjects } = useData()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [project, setProject] = useState(null)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const [showDesignTeamPopup, setShowDesignTeamPopup] = useState(false)

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

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === Number.parseInt(id))
    setProject(foundProject)
    
    // Reset image index when project changes
    if (foundProject) {
      setCurrentImageIndex(0)
    }
  }, [id, projects])

  const handlePrevImage = () => {
    if (project && project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1))
    }
  }

  const handleNextImage = () => {
    if (project && project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1))
    }
  }

  const handleIndicatorClick = (index) => {
    setCurrentImageIndex(index)
  }
  
  const handleDesignTeamClick = () => {
    setShowDesignTeamPopup(true)
  }

  const closeDesignTeamPopup = () => {
    setShowDesignTeamPopup(false)
  }

  // Show loading only if we truly have no data and are actively loading
  if (loading.projects && projects.length === 0) {
    return (
      <div className="project-loading">
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

  if (!project) {
    return (
      <div className="project-loading">
        <h2>Project not found</h2>
        <p>The project you're looking for doesn't exist or may have been removed.</p>
        <button onClick={() => navigate('/')} className="back-home-btn">
          Go Back to Home
        </button>
      </div>
    )
  }

  // Handle both single image and multiple images
  const projectImages = project.images && Array.isArray(project.images) && project.images.length > 0 
    ? project.images.map(img => getImageUrl(img))
    : project.image 
      ? [getImageUrl(project.image)] 
      : ["/placeholder.svg"]



  return (
    <div className="project-detail-page">
      <div className="project-gallery">
        <div className="gallery-container">
          {projectImages.length > 1 && (
            <button className="nav-arrow nav-arrow-left" onClick={handlePrevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          <div className="gallery-image-container">
            <img
              src={projectImages[currentImageIndex] || "/placeholder.svg"}
              alt={project.title}
              className="gallery-image"
              onError={(e) => {
                console.warn('Project detail image failed to load:', projectImages[currentImageIndex]);
                e.target.src = "/placeholder.svg?height=400&width=600&text=Image+Not+Found";
              }}

            />
                          <div className="project-title-overlay">
                <h1>{project.title}</h1>
                {projectImages.length > 1 && (
                  <div className="image-counter">
                    {currentImageIndex + 1} / {projectImages.length}
                  </div>
                )}
                              <button 
                 onClick={async () => {
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
                 }}
                 className="refresh-btn"
                 title="Refresh project images"
               >
                 ↻ Refresh
               </button>
            </div>
          </div>

          {projectImages.length > 1 && (
            <button className="nav-arrow nav-arrow-right" onClick={handleNextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {projectImages.length > 1 && (
          <div className="gallery-indicators">
            {projectImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentImageIndex ? "active" : ""}`}
                onClick={() => handleIndicatorClick(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="project-info-section">
        <div className="project-info-table">
          <div className="info-row">
            <div className="info-cell">PROJECT NAME</div>
            <div className="info-cell">CLIENT</div>
            <div className="info-cell">YEAR</div>
            <div className="info-cell">LOCATION</div>
            <div className="info-cell">DESIGN TEAM</div>
            <div className="info-cell">STATUS</div>
          </div>
          <div className="info-row info-data">
            <div className="info-cell">{project.title || 'N/A'}</div>
            <div className="info-cell">{project.client || 'N/A'}</div>
            <div className="info-cell">{project.year || 'N/A'}</div>
            <div className="info-cell">{project.location || 'N/A'}</div>
            <div className="info-cell design-team-clickable" onClick={handleDesignTeamClick}>
              Design Team
            </div>
            <div className="info-cell">{project.status || 'N/A'}</div>
          </div>
        </div>
        
        {project.description && (
          <div className="project-description-section">
            <h2>Project Description</h2>
            <p>{project.description}</p>
          </div>
        )}
        
        {project.category && (
          <div className="project-category-section">
            <h3>Category: <span>{project.category}</span></h3>
          </div>
        )}
      </div>
      
      {/* Design Team Popup */}
      {showDesignTeamPopup && (
        <div className="design-team-popup-overlay" onClick={closeDesignTeamPopup}>
          <div className="design-team-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Design Team</h3>
              <button className="popup-close" onClick={closeDesignTeamPopup}>×</button>
            </div>
            <div className="popup-content">
              <p>{project.designTeam || 'NAMAS Architecture'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetailPage
