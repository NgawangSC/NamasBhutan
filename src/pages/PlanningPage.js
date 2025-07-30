"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import { getImageUrl } from "../utils/imageUtils"
import "./PlanningPage.css"

const PlanningPage = () => {
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

  // Planning page categories - projects that fall under planning services
  const planningCategories = [
    "Planning"
  ]

  useEffect(() => {
    // Fetch projects if not already loaded
    if (projects.length === 0 && !loading.projects) {
      fetchProjects()
    }
  }, [projects, loading.projects, fetchProjects])

  // Filter projects to show only planning related categories
  const planningProjects = projects.filter(project => 
    planningCategories.includes(project.category)
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.planning-filter-item')) {
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
    const values = planningProjects.map(project => project[field]).filter(Boolean)
    return [...new Set(values)].sort()
  }

  // Apply filters to projects
  const filteredProjects = planningProjects.filter(project => {
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
    <div className="planning-page">
      <div className="planning-header">
        <h1>Planning Projects</h1>
        <p>Explore our comprehensive planning and development services</p>
      </div>

      <div className="planning-projects-grid">
        {filteredProjects.map((project) => {
          const projectImage = project.images && Array.isArray(project.images) && project.images.length > 0 
            ? getImageUrl(project.images[0])
            : project.image 
              ? getImageUrl(project.image) 
              : "/placeholder.svg"

          return (
            <div 
              key={project.id} 
              className="planning-project-card"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="planning-project-image-container">
                <img
                  src={projectImage}
                  alt={project.title}
                  className="planning-project-image"
                  onError={(e) => {
                    console.warn('Planning project image failed to load:', projectImage);
                    e.target.src = "/placeholder.svg?height=300&width=400&text=Image+Not+Found";
                  }}
                />
                <div className="planning-project-overlay">
                  <div className="planning-project-info">
                    <h3 className="planning-project-title">{project.title}</h3>
                    <p className="planning-project-category">{project.category}</p>
                    <div className="planning-project-details">
                      <span className="planning-project-location">{project.location}</span>
                      <span className="planning-project-year">{project.year}</span>
                    </div>
                    <div className="planning-project-status">
                      <span className={`planning-status-badge ${project.status?.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                    </div>
                    <button 
                      className="planning-read-btn"
                      onClick={(e) => handleReadClick(e, project.id)}
                    >
                      READ MORE
                    </button>
                  </div>
                </div>
              </div>
              
              {project.description && (
                <div className="planning-project-description">
                  <p>{project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="planning-filter-section">
        <div className="planning-filter-controls">
          {/* YEAR */}
          <div className="planning-filter-item">
            <div onClick={(e) => handleDropdownToggle(e, 'year')} className="planning-filter-dropdown-trigger">
              <span>{filters.year || 'YEAR'}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`planning-dropdown-arrow ${openDropdown === 'year' ? 'planning-rotated' : ''}`}>
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {openDropdown === 'year' && (
              <div className="planning-dropup">
                <div className="planning-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'year', '')}>All Years</div>
                {getUniqueValues('year').map(year => (
                  <div key={year} className="planning-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'year', year)}>{year}</div>
                ))}
              </div>
            )}
          </div>

          {/* LOCATION */}
          <div className="planning-filter-item">
            <div onClick={(e) => handleDropdownToggle(e, 'location')} className="planning-filter-dropdown-trigger">
              <span>{filters.location || 'LOCATION'}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`planning-dropdown-arrow ${openDropdown === 'location' ? 'planning-rotated' : ''}`}>
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {openDropdown === 'location' && (
              <div className="planning-dropup">
                <div className="planning-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'location', '')}>All Locations</div>
                {getUniqueValues('location').map(location => (
                  <div key={location} className="planning-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'location', location)}>{location}</div>
                ))}
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="planning-filter-item">
            <div onClick={(e) => handleDropdownToggle(e, 'status')} className="planning-filter-dropdown-trigger">
              <span>{filters.status || 'STATUS'}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`planning-dropdown-arrow ${openDropdown === 'status' ? 'planning-rotated' : ''}`}>
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {openDropdown === 'status' && (
              <div className="planning-dropup">
                <div className="planning-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'status', '')}>All Status</div>
                {getUniqueValues('status').map(status => (
                  <div key={status} className="planning-dropup-item" onClick={(e) => handleDropdownItemClick(e, 'status', status)}>{status}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="planning-no-projects">
          <h3>No projects found</h3>
          <p>Try adjusting your filters to see more projects.</p>
        </div>
      )}
    </div>
  )
}

export default PlanningPage