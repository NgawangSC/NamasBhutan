"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import { getImageUrl } from "../utils/imageUtils"
import "./ArchitecturePage.css"

const ArchitecturePage = () => {
  const navigate = useNavigate()
  const { projects, loading, fetchProjects } = useData()

  // Filter states
  const [filters, setFilters] = useState({
    year: '',
    location: '',
    category: '',
    status: ''
  })
  const [openDropdown, setOpenDropdown] = useState(null)

  // Categories that should appear on the Architecture page
  const architectureCategories = [
    "Architecture",
  ]

  useEffect(() => {
    // Fetch projects if not already loaded
    if (projects.length === 0 && !loading.projects) {
      fetchProjects()
    }
  }, [projects, loading.projects, fetchProjects])

  // Filter projects to show only architecture related categories
  const architectureProjects = projects.filter(project => 
    architectureCategories.includes(project.category)
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.architect-filter-item')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openDropdown])

  const handleReadClick = (e, projectId) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/project/${projectId}`)
  }

  const handleDropdownToggle = (e, filterType) => {
    e.stopPropagation()
    setOpenDropdown(openDropdown === filterType ? null : filterType)
  }

  const handleDropdownItemClick = (e, filterType, value) => {
    e.stopPropagation()
    setFilters(prev => ({ ...prev, [filterType]: value }))
    setOpenDropdown(null)
  }

  const getUniqueValues = (field) => {
    const values = architectureProjects.map(project => project[field]).filter(Boolean)
    return [...new Set(values)].sort()
  }

  // Apply filters to projects
  const filteredProjects = architectureProjects.filter(project => {
    return (
      (!filters.year || project.year === filters.year) &&
      (!filters.location || project.location === filters.location) &&
      (!filters.category || project.category === filters.category) &&
      (!filters.status || project.status === filters.status)
    )
  })

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`)
  }

  return (
    <div className="architect-page">
      <div className="architect-header">
        <h1>Architecture Projects</h1>
        <p>Explore our architectural design portfolio</p>
      </div>

      <div className="architect-projects-grid">
        {filteredProjects.map((project) => {
          const projectImage = project.images && Array.isArray(project.images) && project.images.length > 0 
            ? getImageUrl(project.images[0])
            : project.image 
              ? getImageUrl(project.image) 
              : "/placeholder.svg"

          return (
            <div 
              key={project.id} 
              className="architect-project-card"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="architect-project-image-container">
                <img
                  src={projectImage}
                  alt={project.title}
                  className="architect-project-image"
                  onError={(e) => {
                    console.warn('Architecture project image failed to load:', projectImage);
                    e.target.src = "/placeholder.svg?height=300&width=400&text=Image+Not+Found";
                  }}
                />
                <div className="architect-project-overlay">
                  <div className="architect-project-info">
                    <h3 className="architect-project-title">{project.title}</h3>
                    <p className="architect-project-category">{project.category}</p>
                    <div className="architect-project-details">
                      <span className="architect-project-location">{project.location}</span>
                      <span className="architect-project-year">{project.year}</span>
                    </div>
                    <div className="architect-project-status">
                      <span className={`architect-status-badge ${project.status?.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                    </div>
                    <button 
                      className="architect-read-btn"
                      onClick={(e) => handleReadClick(e, project.id)}
                    >
                      READ MORE
                    </button>
                  </div>
                </div>
              </div>
              
              {project.description && (
                <div className="architect-project-description">
                  <p>{project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="architect-filter-section">
        <div className="architect-filter-controls">
          {/* YEAR */}
          <div className="architect-filter-item">
            <div onClick={(e) => handleDropdownToggle(e, 'year')} className="architect-filter-dropdown-trigger">
              <span>{filters.year || 'YEAR'}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`architect-dropdown-arrow ${openDropdown === 'year' ? 'architect-rotated' : ''}`}>
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {openDropdown === 'year' && (
              <div className="architect-dropup">
                <div className="architect-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'year', '')}>All Years</div>
                {getUniqueValues('year').map(year => (
                  <div key={year} className="architect-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'year', year)}>{year}</div>
                ))}
              </div>
            )}
          </div>

          {/* LOCATION */}
          <div className="architect-filter-item">
            <div onClick={(e) => handleDropdownToggle(e, 'location')} className="architect-filter-dropdown-trigger">
              <span>{filters.location || 'LOCATION'}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`architect-dropdown-arrow ${openDropdown === 'location' ? 'architect-rotated' : ''}`}>
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {openDropdown === 'location' && (
              <div className="architect-dropup">
                <div className="architect-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'location', '')}>All Locations</div>
                {getUniqueValues('location').map(location => (
                  <div key={location} className="architect-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'location', location)}>{location}</div>
                ))}
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="architect-filter-item">
            <div onClick={(e) => handleDropdownToggle(e, 'status')} className="architect-filter-dropdown-trigger">
              <span>{filters.status || 'STATUS'}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`architect-dropdown-arrow ${openDropdown === 'status' ? 'architect-rotated' : ''}`}>
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {openDropdown === 'status' && (
              <div className="architect-dropup">
                <div className="architect-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'status', '')}>All Status</div>
                {getUniqueValues('status').map(status => (
                  <div key={status} className="architect-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'status', status)}>{status}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="architect-no-projects">
          <h3>No projects found</h3>
          <p>Try adjusting your filters to see more projects.</p>
        </div>
      )}
    </div>
  )
}

export default ArchitecturePage