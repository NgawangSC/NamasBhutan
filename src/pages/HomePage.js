import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useData } from "../contexts/DataContext"
import { getImageUrl } from "../utils/imageUtils"
import HeroBanner from "../components/HeroBanner"
import HeroBannerFixed from "../components/HeroBannerFixed"
import HeroBannerSelfContained from "../components/HeroBannerSelfContained"
import DebugFeaturedProjects from "../components/DebugFeaturedProjects"
import "./HomePage.css"

function HomePage() {
  const navigate = useNavigate()
  const { getRecentProjects, clients, loading, fetchClients, featuredProjects, fetchFeaturedProjects, fetchProjects } = useData()
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedTestimonial < testimonials.length - 1) {
      setSelectedTestimonial(selectedTestimonial + 1);
    }
    if (isRightSwipe && selectedTestimonial > 0) {
      setSelectedTestimonial(selectedTestimonial - 1);
    }
  };

  const nextTestimonial = () => {
    setSelectedTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setSelectedTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const [currentClientSlide, setCurrentClientSlide] = useState(0)

  // Projects slider state
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [projectTouchStart, setProjectTouchStart] = useState(null);
  const [projectTouchEnd, setProjectTouchEnd] = useState(null);

  // Touch/swipe functionality for projects
  const handleProjectTouchStart = (e) => {
    setProjectTouchEnd(null);
    setProjectTouchStart(e.targetTouches[0].clientX);
  };

  const handleProjectTouchMove = (e) => {
    setProjectTouchEnd(e.targetTouches[0].clientX);
  };

  const handleProjectTouchEnd = () => {
    if (!projectTouchStart || !projectTouchEnd) return;
    
    const distance = projectTouchStart - projectTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentProjectSlide < recentProjects.length - 1) {
      setCurrentProjectSlide(currentProjectSlide + 1);
    }
    if (isRightSwipe && currentProjectSlide > 0) {
      setCurrentProjectSlide(currentProjectSlide - 1);
    }
  };

  const nextProjectSlide = () => {
    setCurrentProjectSlide((prev) => 
      prev === recentProjects.length - 1 ? 0 : prev + 1
    );
  };

  const prevProjectSlide = () => {
    setCurrentProjectSlide((prev) => 
      prev === 0 ? recentProjects.length - 1 : prev - 1
    );
  };

  // Responsive clients per slide
  const [clientsPerSlide, setClientsPerSlide] = useState(3);
  
  useEffect(() => {
    const updateClientsPerSlide = () => {
      if (window.innerWidth <= 768) {
        setClientsPerSlide(1); // Single client on mobile
      } else if (window.innerWidth <= 968) {
        setClientsPerSlide(2); // Two clients on tablet
      } else {
        setClientsPerSlide(3); // Three clients on desktop
      }
    };

    updateClientsPerSlide();
    window.addEventListener('resize', updateClientsPerSlide);
    return () => window.removeEventListener('resize', updateClientsPerSlide);
  }, []);

  const totalClientSlides = Math.max(1, Math.ceil(clients.length / clientsPerSlide))

  // Touch/swipe functionality for clients
  const [clientTouchStart, setClientTouchStart] = useState(null);
  const [clientTouchEnd, setClientTouchEnd] = useState(null);

  const handleClientTouchStart = (e) => {
    setClientTouchEnd(null);
    setClientTouchStart(e.targetTouches[0].clientX);
  };

  const handleClientTouchMove = (e) => {
    setClientTouchEnd(e.targetTouches[0].clientX);
  };

  const handleClientTouchEnd = () => {
    if (!clientTouchStart || !clientTouchEnd) return;
    
    const distance = clientTouchStart - clientTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextClientSlide();
    }
    if (isRightSwipe) {
      prevClientSlide();
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    console.log('HomePage: Fetching initial data...')
    fetchClients()
    fetchFeaturedProjects()
  }, [fetchClients, fetchFeaturedProjects])

  // Debug featuredProjects
  useEffect(() => {
    console.log('HomePage: featuredProjects changed:', featuredProjects)
    console.log('HomePage: featuredProjects length:', featuredProjects?.length || 0)
  }, [featuredProjects])

  // Also fetch data when the window gains focus (user returns from dashboard)
  useEffect(() => {
    let timeoutId
    
    const handleFocus = () => {
      // Debounce to prevent multiple rapid calls
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        fetchClients()
        fetchFeaturedProjects()
        fetchProjects()
      }, 300)
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
      clearTimeout(timeoutId)
    }
  }, [fetchClients, fetchFeaturedProjects, fetchProjects])

  // Refresh featured projects periodically to ensure hero banner is up to date
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFeaturedProjects()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [fetchFeaturedProjects])

  // Get the 6 most recent projects from the dashboard
  const recentProjects = getRecentProjects(6).map(project => {
    return {
      id: project.id,
      name: project.title,
      year: project.year,
      image: project.image,
      alt: project.title,
      date: project.createdAt || project.date
    };
  })

  const testimonials = [
    {
      id: 1,
      name: "Jennifer Hilbertson",
      quote:
        "The Seascape Villas project constitutes one of the first urban interventions in this very unique context, a landscape dominated by mountains and sea.",
      title: "Architecture Critic",
    },
    {
      id: 2,
      name: "Michael Chen",
      quote:
        "Their innovative approach to sustainable design has transformed our understanding of modern architecture. Every project tells a unique story.",
      title: "Urban Planner",
    },
    {
      id: 3,
      name: "Sarah Williams",
      quote:
        "Working with this team was an exceptional experience. They brought our vision to life while exceeding all our expectations for functionality and beauty.",
      title: "Property Developer",
    },
    {
      id: 4,
      name: "David Rodriguez",
      quote:
        "The attention to detail and commitment to excellence is evident in every aspect of their work. Truly masters of their craft.",
      title: "Interior Designer",
    },
  ]



  const nextClientSlide = () => {
    setCurrentClientSlide((prev) => (prev + 1) % totalClientSlides)
  }

  const prevClientSlide = () => {
    setCurrentClientSlide((prev) => (prev - 1 + totalClientSlides) % totalClientSlides)
  }

  const handleReadMore = (projectId) => {
    navigate(`/project/${projectId}`)
  }

  return (
    <div className="homepage">
      {/* Hero Banner Section with Featured Projects - Self-Contained Version */}
      <HeroBannerSelfContained />

      {/* About Us Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-content">
            <div className="experience-card">
              <img src="/images/experience-bg.jpeg" alt="5 Years of Experience" className="cutout-image" />
            </div>
            <div className="about-text-side">
              <div className="about-header">ABOUT US</div>
              <h2 className="about-title">Awesome Design for Bhutan</h2>
              <div className="about-description">
                <p>
                  Based on collective work and shared knowledge, Architecture-Studio aims to favour dialogue and debate,
                  to transform individual knowledge into increased creative potential.
                </p>
                <p>
                  Our Studio is a architecture practice based in Prague, Czech and Venice. Today, it includes 150
                  architects, urban planners, landscape and interior designers of 25 different nationalities. The
                  company principle of Architecture-Studio is the collective conception.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="projects-container">
          <div className="projects-header">
            <div className="projects-label">LAST PROJECTS</div>
            <h2 className="projects-title">Make it with passion.</h2>
          </div>
          <div 
            className="projects-grid"
            onTouchStart={handleProjectTouchStart}
            onTouchMove={handleProjectTouchMove}
            onTouchEnd={handleProjectTouchEnd}
          >
            {loading.projects ? (
              <div className="projects-loading">
                <p>Loading projects...</p>
              </div>
            ) : recentProjects.length > 0 ? (
              <>
                {/* Desktop view - show all projects */}
                <div className="projects-desktop-view">
                  {recentProjects.map((project, index) => (
                    <div 
                      key={project.id} 
                      className={`project-card ${index % 2 === 1 ? "project-card-reverse" : ""}`}
                    >
                      {index % 2 === 0 ? (
                        <>
                          <div className="project-image">
                            <img 
                              src={getImageUrl(project.image) || "/images/placeholder.png"} 
                              alt={project.alt || project.name} 
                              className="project-img" 
                            />
                          </div>
                          <div className="project-details">
                            <div className="project-year">{project.year}</div>
                            <h3 className="project-name">{project.name}</h3>
                            <button className="project-read-btn" onClick={() => handleReadMore(project.id)}>
                              Read <ChevronRight size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="project-details">
                            <div className="project-year">{project.year}</div>
                            <h3 className="project-name">{project.name}</h3>
                            <button className="project-read-btn" onClick={() => handleReadMore(project.id)}>
                              Read <ChevronRight size={16} />
                            </button>
                          </div>
                          <div className="project-image">
                            <img 
                              src={getImageUrl(project.image) || "/images/placeholder.png"} 
                              alt={project.alt || project.name} 
                              className="project-img" 
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile view - show one project at a time */}
                <div className="projects-mobile-view">
                  {recentProjects.length > 0 && (
                    <div className="project-card mobile-project-card">
                      <div className="project-image">
                        <img 
                          src={getImageUrl(recentProjects[currentProjectSlide].image) || "/images/placeholder.png"} 
                          alt={recentProjects[currentProjectSlide].alt || recentProjects[currentProjectSlide].name} 
                          className="project-img" 
                        />
                      </div>
                      <div className="project-details">
                        <div className="project-year">{recentProjects[currentProjectSlide].year}</div>
                        <h3 className="project-name">{recentProjects[currentProjectSlide].name}</h3>
                        <button className="project-read-btn" onClick={() => handleReadMore(recentProjects[currentProjectSlide].id)}>
                          Read <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Navigation for Projects */}
                <div className="projects-mobile-nav">
                  <button 
                    className="project-nav-btn prev" 
                    onClick={prevProjectSlide}
                    aria-label="Previous project"
                  >
                    ‹
                  </button>
                  <div className="projects-dots">
                    {recentProjects.map((_, index) => (
                      <button
                        key={index}
                        className={`project-dot ${index === currentProjectSlide ? 'active' : ''}`}
                        onClick={() => setCurrentProjectSlide(index)}
                        aria-label={`Go to project ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button 
                    className="project-nav-btn next" 
                    onClick={nextProjectSlide}
                    aria-label="Next project"
                  >
                    ›
                  </button>
                </div>
              </>
            ) : (
              <div className="no-projects">
                <p>No projects available. Add some projects in the dashboard to see them here!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <div className="testimonials-label">TESTIMONIALS</div>
            <h2 className="testimonials-title">They love us</h2>
          </div>
          <div className="testimonials-content">
            <div className="testimonials-list">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  onClick={() => setSelectedTestimonial(index)}
                  className={`testimonial-name-btn ${index === selectedTestimonial ? "active" : ""}`}
                >
                  {testimonial.name}
                </button>
              ))}
            </div>
            <div 
              className="testimonial-quote-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="quote-mark">"</div>
              <div className="testimonial-quote">{testimonials[selectedTestimonial].quote}</div>
              <div className="testimonial-author">-{testimonials[selectedTestimonial].name}</div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="testimonials-mobile-nav">
              <button 
                className="testimonial-nav-btn prev" 
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <div className="testimonials-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`testimonial-dot ${index === selectedTestimonial ? 'active' : ''}`}
                    onClick={() => setSelectedTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                className="testimonial-nav-btn next" 
                onClick={nextTestimonial}
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="clients-section">
        <div className="clients-container">
          <div className="clients-header">
            <img src="/images/people-clients.png" alt="People Clients" className="clients-title-image" />
          </div>
          <div 
            className="clients-carousel"
            onTouchStart={handleClientTouchStart}
            onTouchMove={handleClientTouchMove}
            onTouchEnd={handleClientTouchEnd}
          >
            {loading.clients ? (
              <div className="clients-loading">
                <p>Loading clients...</p>
              </div>
            ) : clients.length > 0 ? (
              <>
                <button onClick={prevClientSlide} className="clients-arrow clients-arrow-left">
                  <ChevronLeft size={24} />
                </button>
                <div className="clients-grid">
                  {clients
                    .slice(currentClientSlide * clientsPerSlide, (currentClientSlide + 1) * clientsPerSlide)
                    .map((client) => (
                      <div key={client.id} className="client-card">
                        <div className="client-logo">
                          <img 
                            src={getImageUrl(client.logo)} 
                            alt={client.name}
                            onError={(e) => {
                              e.target.src = "/images/placeholder-logo.png"
                            }}
                          />
                          <div className="client-name">{client.name}</div>
                        </div>
                      </div>
                    ))}
                </div>
                <button onClick={nextClientSlide} className="clients-arrow clients-arrow-right">
                  <ChevronRight size={24} />
                </button>
                
                {/* Mobile Navigation for Clients */}
                <div className="clients-mobile-nav">
                  <button 
                    className="client-nav-btn prev" 
                    onClick={prevClientSlide}
                    aria-label="Previous clients"
                  >
                    ‹
                  </button>
                  <div className="clients-dots">
                    {Array.from({ length: totalClientSlides }, (_, index) => (
                      <button
                        key={index}
                        className={`client-dot ${index === currentClientSlide ? 'active' : ''}`}
                        onClick={() => setCurrentClientSlide(index)}
                        aria-label={`Go to client slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button 
                    className="client-nav-btn next" 
                    onClick={nextClientSlide}
                    aria-label="Next clients"
                  >
                    ›
                  </button>
                </div>
              </>
            ) : (
              <div className="no-clients">
                <p>No clients available. Add some clients in the dashboard to see them here!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage