const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || window.location.origin
    : 'http://localhost:5000',
  
  // Dashboard configuration
  DASHBOARD_ENABLED: true,
  
  // File upload configuration
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  
  // Supported file types
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  
  // API endpoints
  ENDPOINTS: {
    PROJECTS: '/api/projects',
    TEAM: '/api/team',
    BLOGS: '/api/blogs',
    CLIENTS: '/api/clients',
    HERO_BANNER: '/api/hero-banner',
    RECENT_PROJECTS: '/api/recent-projects',
    MEDIA: '/api/media',
    UPLOAD: '/api/upload',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout'
  }
};

export default config;