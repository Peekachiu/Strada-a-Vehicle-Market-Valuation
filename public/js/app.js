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
 * Renders the correct header based on user login state.
 */
function renderHeader(user) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const loggedIn = isUserLoggedIn(); // Check the token
  
  const userName = user?.displayName || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  
  if (loggedIn && user) {
    // Render logged-in navbar (Same as your old code)
    header.innerHTML = `
      <div class="container navbar">
        <a class="brand" href="#home" data-navigate="home">
          <div class="brand-icon-box">...</div> <span class="brand-text">Strada</span>
        </a>
        <nav class="nav-links" aria-label="Main navigation">
          <a href="#home" class="nav-item" data-navigate="home">...<span>Home</span></a>
          <a href="#about" class="nav-item" data-navigate="about">...<span>About Us</span></a>
          <a href="#valuation" class="nav-item" data-navigate="valuation">...<span>Get Car Price</span></a>
        </nav>
        <div class="nav-auth user-menu">
          <button class="avatar-button" id="user-menu-btn" aria-label="User menu">
            <div class="avatar-fallback">${userInitial}</div>
          </button>
          <div class="dropdown-menu" id="user-dropdown">
            <div class="dropdown-label">
              <p class="dropdown-user-name">${userName}</p>
              <p class="dropdown-user-email">Manage your account</p>
            </div>
            <div class="dropdown-separator"></div>
            <a href="#profile" class="dropdown-item" data-navigate="profile">...<span>Profile</span></a>
            <div class="dropdown-separator"></div>
            <a href="#" class="dropdown-item" id="logout-btn">...<span>Log out</span></a>
          </div>
        </div>
      </div>
    `;
  } else {
    // Render guest navbar (Same as your old code)
    header.innerHTML = `
      <div class="container navbar">
        <a class="brand" href="#login" data-navigate="login">
          <div class="brand-icon-box">...</div> <span class="brand-text">Strada</span>
        </a>
        <nav class="nav-links nav-links-guest" aria-label="Main navigation">
          <a href="#login" class="nav-item" data-navigate="login">Login</a>
          <a href="#signup" class="btn btn-dark" data-navigate="signup">Sign Up</a>
        </nav>
      </div>
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