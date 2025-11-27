import { renderHero } from './views/heroView.js';
import { renderAbout } from './views/aboutView.js';
import { renderLogin } from './views/loginView.js';
import { renderSignUp } from './views/signupView.js';
import { renderValuationPage } from './views/valuationView.js';
import { renderGallery } from './views/galleryView.js';
import { ValuationController } from './controllers/valuationController.js';
import { LoginController } from './controllers/loginController.js';
import { SignUpController } from './controllers/signupController.js';
import { HistoryController } from './controllers/historyController.js';
import { ProfileController } from './controllers/profileController.js';

// Global state for the app
const appState = {
  currentUser: null // Will be { displayName: 'username' }
};

function isUserLoggedIn() {
  const token = localStorage.getItem('accessToken');
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
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      displayName: payload.username || 'User'
    };
  } catch (e) {
    console.error("Failed to decode token:", e);
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
 * Renders the new, conflict-free Navbar.
 */
function renderHeader(user) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const loggedIn = isUserLoggedIn();
  const userName = user?.displayName || 'User';
  const userEmail = user?.email || 'Manage Account';
  const userInitial = userName.charAt(0).toUpperCase();

  // Helper for active state
  const isActive = (page) => router.currentPage === page ? 'active' : '';

  // Your Logo Image
  const logoHTML = `<img src="assets/images/strada_logo.jpg" alt="Strada" class="nav-logo-img">`;

  // Icons
  const icons = {
    home: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    info: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    money: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    user: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    logout: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
  };

  if (loggedIn && user) {
    // --- LOGGED IN ---
    header.innerHTML = `
      <nav class="site-navbar">
        <a class="nav-brand" href="#home" data-navigate="home">
          <div class="nav-logo-wrapper">
            ${logoHTML}
          </div>
          <span class="nav-brand-text">Strada</span>
        </a>

        <div class="site-nav-links">
          <button class="site-nav-item ${isActive('home')}" data-navigate="home">
            ${icons.home} Home
          </button>
          <button class="site-nav-item ${isActive('about')}" data-navigate="about">
            ${icons.info} About Us
          </button>
          <button class="site-nav-item ${isActive('valuation')}" data-navigate="valuation">
            ${icons.money} Get Car Price
          </button>
        </div>

        <div class="nav-user-section">
          <div class="nav-avatar-btn" id="user-menu-btn">
            ${userInitial}
          </div>
          
          <div class="nav-dropdown" id="user-dropdown">
            <div class="nav-dropdown-header">
              <p class="nav-user-name">${userName}</p>
              <p class="nav-user-email">${userEmail}</p>
            </div>
            <a class="nav-dropdown-item" data-navigate="profile">
              ${icons.user} Profile
            </a>
            <a class="nav-dropdown-item" id="logout-btn">
              ${icons.logout} Log out
            </a>
          </div>
        </div>
      </nav>
    `;
  } else {
    // --- GUEST ---
    header.innerHTML = `
      <nav class="site-navbar">
        <a class="nav-brand" href="#login" data-navigate="login">
          <div class="nav-logo-wrapper">
            ${logoHTML}
          </div>
          <span class="nav-brand-text">Strada</span>
        </a>

        <div class="site-nav-links guest-mode">
          <button class="site-nav-item" data-navigate="login">Login</button>
          <button class="site-nav-item active" data-navigate="signup">Sign Up</button>
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
      // We use the Controller now, instead of calling the View directly
      const profileController = new ProfileController(main);
      profileController.init();
    } else {
      // 404
      this.navigate(isUserLoggedIn() ? 'home' : 'login'); // Default to home or login
      return;
    }

    const activeNav = document.querySelector(activeNavSelector);
    if (activeNav) activeNav.classList.add('active');

    // Re-initialize scroll animations for new content
    if (window.initScrollAnimations) {
      setTimeout(window.initScrollAnimations, 100); // Small delay to ensure DOM is ready
    }
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

  // 7. Scroll Animation Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Function to observe elements (can be called after dynamic content loads)
  window.initScrollAnimations = () => {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  };

  // Initial check
  window.initScrollAnimations();
});