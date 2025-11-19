import { renderHero } from './views/heroView.js';
import { renderAbout } from './views/aboutView.js';
import { renderLogin } from './views/loginView.js';
import { renderSignUp } from './views/signupView.js';
import { renderValuationPage } from './views/valuationView.js';
import { renderProfile } from './views/profileView.js';
import { ValuationController } from './controllers/valuationController.js';
import { LoginController } from './controllers/loginController.js';
import { SignUpController } from './controllers/signupController.js';

// Global state for the app
const appState = {
  currentUser: null // Will be { displayName: 'username' }
};

/**
 * Helper function to check login state by looking for our token.
 */
function isUserLoggedIn() {
  const token = localStorage.getItem('accessToken');
  // We're just checking if the token *exists* for now
  return !!token;
}

/**
 * Helper function to get user info from the token
 * A JWT token contains the user's data (like username)
 * This function decodes it.
 */
function getUserFromToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  try {
    // The token is in three parts: header.payload.signature
    // The payload (the middle part) is Base64-encoded JSON
    const payload = JSON.parse(atob(token.split('.')[1]));
    // 'payload.username' might be different based on your JWT settings
    // Let's check for 'username' or 'user_id'
    // For now, let's just create a simple object
    // We will build a /api/me/ endpoint later to get full user details
    return {
      displayName: payload.username || 'User' 
    };
  } catch (e) {
    console.error("Failed to decode token:", e);
    // Token might be invalid or expired, so log the user out
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }
}

/**
 * Logs the user out by clearing tokens and re-rendering.
 */
function handleLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  appState.currentUser = null;
  renderHeader(null);
  router.navigate('login');
}

/**
 * Renders the modern Glassmorphism header.
 */
function renderHeader(user) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const loggedIn = isUserLoggedIn();
  const userName = user?.displayName || 'User';
  // Get email or default text for the dropdown
  const userEmail = user?.email || 'Manage your account'; 
  const userInitial = userName.charAt(0).toUpperCase();

  // Helper to determine active state
  const isActive = (page) => router.currentPage === page ? 'active' : '';

  // --- ICONS (Converted from Lucide React) ---
  const icons = {
    car: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8z"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
    home: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    dollar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    logout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
  };

  // Use your custom logo image if available, otherwise use Car Icon
  const logoContent = `<img src="static/assets/images/strada_logo.jpg" alt="Strada" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;

  if (loggedIn && user) {
    // --- LOGGED IN ---
    header.innerHTML = `
      <nav class="navbar-glass">
        <a class="brand-group" href="#home" data-navigate="home">
          <div class="brand-icon-wrapper" style="padding:0; overflow:hidden; background:transparent; width:40px; height:40px;">
             ${logoContent}
          </div>
          <span class="brand-text-gradient">Strada</span>
        </a>

        <div class="nav-links-container">
          <button class="nav-btn ${isActive('home')}" data-navigate="home">
            ${icons.home} Home
          </button>
          <button class="nav-btn ${isActive('about')}" data-navigate="about">
            ${icons.info} About Us
          </button>
          <button class="nav-btn ${isActive('valuation')}" data-navigate="valuation">
            ${icons.dollar} Get Car Price
          </button>
        </div>

        <div class="user-menu-container">
          <div class="avatar-ring" id="user-menu-btn">
            <div class="avatar-inner">${userInitial}</div>
          </div>

          <div class="glass-dropdown" id="user-dropdown">
            <div class="dropdown-header">
              <p class="dropdown-name">${userName}</p>
              <p class="dropdown-email">${userEmail}</p>
            </div>
            
            <a class="dropdown-item-glass" data-navigate="profile">
              ${icons.user} Profile
            </a>
            <a class="dropdown-item-glass" id="logout-btn">
              ${icons.logout} Log out
            </a>
          </div>
        </div>
      </nav>
    `;
  } else {
    // --- GUEST (Login/Signup) ---
    header.innerHTML = `
      <nav class="navbar-glass">
        <a class="brand-group" href="#login" data-navigate="login">
           <div class="brand-icon-wrapper" style="padding:0; overflow:hidden; background:transparent; width:40px; height:40px;">
             ${logoContent}
          </div>
          <span class="brand-text-gradient">Strada</span>
        </a>

        <div class="nav-links-container">
          <button class="nav-btn" data-navigate="login">Login</button>
          <button class="nav-btn active" data-navigate="signup">Sign Up</button>
        </div>
      </nav>
    `;
  }
}

// --- ROUTER & PAGE RENDERING ---

const router = {
  currentPage: null,
  
  navigate(page) {
    if (page === this.currentPage) return;

    const loggedIn = isUserLoggedIn(); // Check token
    const authPages = ['login', 'signup'];
    const isAuthPage = authPages.includes(page);
    
    // 1. If user is NOT logged in and tries to access a protected page
    if (!loggedIn && !isAuthPage) {
      console.log("Guest trying to access protected page. Redirecting to login.");
      this.navigate('login');
      return;
    }
    
    // 2. If user IS logged in and tries to access login/signup
    if (loggedIn && isAuthPage) {
      console.log("User already logged in. Redirecting to home.");
      this.navigate('home');
      return;
    }
    
    // 3. Allow navigation
    window.location.hash = page;
    this.currentPage = page;
    this.render();
    window.scrollTo(0, 0);
  },
  
  render() {
    const main = document.getElementById('main-content');
    if (!main) {
      console.error("'main-content' element not found!");
      return;
    }
    main.innerHTML = '';
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const authPages = ['login', 'signup'];
    if (authPages.includes(this.currentPage)) {
      document.body.classList.add('auth-page');
    } else {
      document.body.classList.remove('auth-page');
    }

    const page = this.currentPage;
    let activeNavSelector = `[data-navigate="${page}"]`;

    if (page === 'home') {
      renderHero(main);
    } else if (page === 'about') {
      renderAbout(main);
    } else if (page === 'login') { 
      renderLogin(main);
      new LoginController(main, this, appState, renderHeader);
    } else if (page === 'signup') { 
      renderSignUp(main);
      new SignUpController(main, this, appState, renderHeader);
    } else if (page === 'valuation') { 
      renderValuationPage(main);
      const valuationController = new ValuationController(main);
      valuationController.init();
    } else if (page === 'my-valuations') {
      main.innerHTML = `<div class="container" style="padding: 4rem 0;"><h1 class="auth-title">My Valuations</h1><p class="auth-sub">Your saved valuations will appear here.</p></div>`;
    } else if (page === 'profile') {
      renderProfile(main, appState.currentUser);
    } else {
      // 404
      this.navigate(isUserLoggedIn() ? 'home' : 'login'); // Default to home or login
      return;
    }
    
    const activeNav = document.querySelector(activeNavSelector);
    if (activeNav) activeNav.classList.add('active');
  }
};

// --- APP INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
  console.log("Strada app initializing...");
  
  // 1. Set up navigation
  document.body.addEventListener('click', (e) => { 
    const navTarget = e.target.closest('a[data-navigate], button[data-navigate]');
    if (navTarget) {
      e.preventDefault();
      const page = navTarget.getAttribute('data-navigate');
      router.navigate(page);
      return;
    }
    
    // Handle REAL logout
    if (e.target.closest('#logout-btn')) {
      e.preventDefault();
      handleLogout();
      return;
    }
    
    // Handle dropdown toggle
    if (e.target.closest('#user-menu-btn')) {
      document.getElementById('user-dropdown')?.classList.toggle('active');
    } else {
      document.getElementById('user-dropdown')?.classList.remove('active');
    }
  });

  // 2. Handle browser back/forward and initial page load
  const handleHashChange = () => {
    const page = window.location.hash.slice(1);
    const loggedIn = isUserLoggedIn();
    
    // On first load, set the user state
    if (loggedIn) {
      appState.currentUser = getUserFromToken();
    } else {
      appState.currentUser = null;
    }
    
    // Re-render header on every navigation
    renderHeader(appState.currentUser);

    const authPages = ['login', 'signup'];
    const isAuthPage = authPages.includes(page);

    if (!loggedIn && !isAuthPage) {
      router.navigate('login');
    } else if (loggedIn && isAuthPage) {
      router.navigate('home');
    } else {
      router.navigate(page || (loggedIn ? 'home' : 'login'));
    }
  };
  
  window.addEventListener('hashchange', handleHashChange);
  
  // 5. Initial Page Load
  handleHashChange(); // This sets up the correct initial page

  // 6. Set footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});