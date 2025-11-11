import { renderHero } from './views/heroView.js';
import { renderAbout } from './views/aboutView.js';
import { renderLogin } from './views/loginView.js';
import { renderSignUp } from './views/signupView.js';
import { renderValuationPage } from './views/valuationView.js';
import { renderProfile } from './views/profileView.js'; // <-- ADD THIS IMPORT
import { ValuationController } from './controllers/valuationController.js';
import { LoginController } from './controllers/loginController.js';
import { SignUpController } from './controllers/signupController.js';

// --- We are bypassing auth.js for dummy mode ---
// import { initAuth, onAuthStateChanged, isUserLoggedIn, logout } from './auth.js';

// Global state for the app
const appState = {
  currentUser: null
};

/**
 * Helper function to check login state
 */
function isUserLoggedIn(user) {
  return !!user; // Is the user object not null?
}

// --- HEADER RENDERING ---

/**
 * Renders the correct header based on user login state.
 * This HTML is converted from your Figma design.
 */
function renderHeader(user) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const loggedIn = isUserLoggedIn(user);
  
  // Helper for user initial
  const userName = user?.displayName || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  
  if (loggedIn) {
    // Render logged-in navbar
    header.innerHTML = `
      <div class="container navbar">
        <!-- 1. Brand Logo (Left) -->
        <a class="brand" href="#home" data-navigate="home">
          <div class="brand-icon-box">
            <svg class="brand-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8z"/>
              <circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
            </svg>
          </div>
          <span class="brand-text">Strada</span>
        </a>
        
        <!-- 2. Nav Links (Center) -->
        <nav class="nav-links" aria-label="Main navigation">
          <a href="#home" class="nav-item" data-navigate="home">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </a>
          <a href="#about" class="nav-item" data-navigate="about">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            <span>About Us</span>
          </a>
          <a href="#valuation" class="nav-item" data-navigate="valuation">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>Get Car Price</span>
          </a>
        </nav>

        <!-- 3. User Menu (Right) -->
        <div class="nav-auth user-menu">
          <button class="avatar-button" id="user-menu-btn" aria-label="User menu">
            <div class="avatar-fallback">${userInitial}</div>
            <!-- <img src="" alt="User" class="avatar-image" /> -->
          </button>
          <div class="dropdown-menu" id="user-dropdown">
            <div class="dropdown-label">
              <p class="dropdown-user-name">${userName}</p>
              <p class="dropdown-user-email">Manage your account</p>
            </div>
            <div class="dropdown-separator"></div>
            <a href="#profile" class="dropdown-item" data-navigate="profile">
              <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Profile</span>
            </a>
            <div class="dropdown-separator"></div>
            <a href="#" class="dropdown-item" id="logout-btn">
              <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Log out</span>
            </a>
          </div>
        </div>
      </div>
    `;
  } else {
    // Render guest navbar
    header.innerHTML = `
      <div class="container navbar">
        <!-- 1. Brand Logo (Left) -->
        <a class="brand" href="#login" data-navigate="login">
          <div class="brand-icon-box">
            <svg class="brand-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8z"/>
              <circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
            </svg>
          </div>
          <span class="brand-text">Strada</span>
        </a>
        
        <!-- 2. Auth Links (Right) -->
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
  currentPage: null, // Start as null
  
  navigate(page) {
    if (page === this.currentPage) return; // Don't re-render same page

    // This is our auth-gate logic
    const loggedIn = isUserLoggedIn(appState.currentUser);
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
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add/Remove class to body to hide/show header
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
      // We now pass the appState and renderHeader to the controller
      new LoginController(main, this, appState, renderHeader);
    } else if (page === 'signup') { 
      renderSignUp(main);
      // We pass these to the signup controller as well
      new SignUpController(main, this, appState, renderHeader);
    } else if (page === 'valuation') { 
      renderValuationPage(main);
      const valuationController = new ValuationController(main);
      valuationController.init();
    } else if (page === 'my-valuations') {
      main.innerHTML = `<div class="container" style="padding: 4rem 0;"><h1 class="auth-title">My Valuations</h1><p class="auth-sub">Your saved valuations will appear here.</p></div>`;
    
    // --- THIS IS THE UPDATED LINE ---
    } else if (page === 'profile') {
      renderProfile(main, appState.currentUser); // <-- USE THE NEW VIEW
    } else {
      // 404
      this.navigate('login'); // Default to login
      return;
    }
    
    // Set active nav
    const activeNav = document.querySelector(activeNavSelector);
    if (activeNav) activeNav.classList.add('active');
  }
};

// --- APP INITIALIZATION ---

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Firebase Auth (SKIPPED FOR DUMMY MODE)
  // await initAuth();

  // 2. Set up auth listener (SKIPPED FOR DUMMY MODE)
  /*
  onAuthStateChanged(user => {
    appState.currentUser = user;
    renderHeader(user); // Re-render header on auth change
    
    // Re-run routing logic to protect pages
    handleHashChange(true); 
  });
  */
  
  // 3. Set up navigation
  document.body.addEventListener('click', (e) => { 
    // Handle nav links
    const navTarget = e.target.closest('a[data-navigate], button[data-navigate]');
    if (navTarget) {
      e.preventDefault();
      const page = navTarget.getAttribute('data-navigate');
      router.navigate(page);
      return;
    }
    
    // Handle dummy logout
    if (e.target.closest('#logout-btn')) {
      e.preventDefault();
      appState.currentUser = null;
      renderHeader(null);
      router.navigate('login');
      return;
    }
    
    // Handle dropdown toggle
    if (e.target.closest('#user-menu-btn')) {
      document.getElementById('user-dropdown')?.classList.toggle('active');
    } else {
      // Hide dropdown if clicking outside
      document.getElementById('user-dropdown')?.classList.remove('active');
    }
  });

  // 4. Handle browser back/forward and initial page load
  const handleHashChange = (isAuthChange = false) => {
    const page = window.location.hash.slice(1);
    const loggedIn = isUserLoggedIn(appState.currentUser);
    
    if (!loggedIn) {
      // Guest: Default to 'login'
      const newPage = (page === 'signup') ? 'signup' : 'login';
      if (newPage !== router.currentPage || isAuthChange) {
        router.navigate(newPage);
      }
    } else {
      // Logged-in: Default to 'home'
      const newPage = (page === 'login' || page === 'signup') ? 'home' : (page || 'home');
      if (newPage !== router.currentPage || isAuthChange) {
        router.navigate(newPage);
      }
    }
  };
  
  window.addEventListener('hashchange', () => handleHashChange(false));
  
  // Manually set initial state and load the first page for dummy mode
  appState.currentUser = null;
  renderHeader(null);
  handleHashChange(false);

  // 5. Set footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});