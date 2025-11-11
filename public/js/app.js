import { renderHero } from './views/heroView.js';
import { renderAbout } from './views/aboutView.js';
import { renderLogin } from './views/loginView.js';
import { renderSignUp } from './views/signupView.js';
import { renderValuationPage } from './views/valuationView.js';
import { ValuationController } from './controllers/valuationController.js';
import { LoginController } from './controllers/loginController.js';
import { SignUpController } from './controllers/signupController.js';
import { initAuth, onAuthStateChanged, isUserLoggedIn, logout } from './auth.js';

// Global state for the app
const appState = {
  currentUser: null
};

// --- HEADER RENDERING ---

/**
 * Renders the correct header based on user login state.
 */
function renderHeader(user) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const loggedIn = isUserLoggedIn(user);
  
  if (loggedIn) {
    // Render logged-in navbar
    header.innerHTML = `
      <div class="container navbar">
        <div class="nav-left">
          <a class="brand" href="#home" data-navigate="home">
            <img src="/assets/images/strada_logo.jpg" onerror="this.style.display='none'" alt="Strada logo" class="brand-icon" />
            <div class="brand-icon-fallback" aria-hidden="true">🚗</div>
            <span>Strada</span>
          </a>
        </div>
        <nav class="nav-links" aria-label="Main navigation">
          <a href="#home" class="nav-item" data-navigate="home">Home</a>
          <a href="#about" class="nav-item" data-navigate="about">About Us</a>
          <a href="#valuation" class="nav-item" data-navigate="valuation">Get Car Price</a>
          <a href="#my-valuations" class="nav-item" data-navigate="my-valuations">My Valuations</a>
        </nav>
        <div class="nav-auth user-menu">
          <button class="user-menu-button" id="user-menu-btn" aria-label="User menu">
            Welcome, ${user.displayName || 'User'}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="dropdown-menu" id="user-dropdown">
            <a href="#profile" data-navigate="profile">Profile</a>
            <a href="#" id="logout-btn">Logout</a>
          </div>
        </div>
      </div>
    `;
  } else {
    // Render guest navbar (will be hidden on login/signup pages)
    header.innerHTML = `
      <div class="container navbar">
        <div class="nav-left">
          <a class="brand" href="#login" data-navigate="login">
            <img src="/assets/images/strada_logo.jpg" onerror="this.style.display='none'" alt="Strada logo" class="brand-icon" />
            <div class="brand-icon-fallback" aria-hidden="true">🚗</div>
            <span>Strada</span>
          </a>
        </div>
        <nav class="nav-links" aria-label="Main navigation">
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
      new LoginController(main, this); // 'this' is the router
    } else if (page === 'signup') { 
      renderSignUp(main);
      new SignUpController(main, this); // 'this' is the router
    } else if (page === 'valuation') { 
      renderValuationPage(main);
      const valuationController = new ValuationController(main);
      valuationController.init();
    } else if (page === 'my-valuations') {
      main.innerHTML = `<div class="container" style="padding: 4rem 0;"><h1 class="auth-title">My Valuations</h1><p class="auth-sub">Your saved valuations will appear here.</p></div>`;
    } else if (page === 'profile') {
      main.innerHTML = `<div class="container" style="padding: 4rem 0;"><h1 class="auth-title">Profile</h1><p class="auth-sub">Your profile settings will go here.</p></div>`;
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
  // 1. Initialize Firebase Auth
  await initAuth();

  // 2. Set up auth listener
  onAuthStateChanged(user => {
    appState.currentUser = user;
    renderHeader(user); // Re-render header on auth change
    
    // Re-run routing logic to protect pages
    handleHashChange(true); 
  });
  
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
    
    // Handle logout
    if (e.target.closest('#logout-btn')) {
      e.preventDefault();
      logout().then(() => {
        router.navigate('login');
      });
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
  // Note: We DON'T run handleHashChange() here. We wait for onAuthStateChanged to fire first.

  // 5. Set footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});