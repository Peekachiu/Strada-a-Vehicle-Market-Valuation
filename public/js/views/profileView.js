/**
 * Helper function to get the auth token from localStorage.
 */
function getAuthToken() {
  return localStorage.getItem('accessToken');
}

/**
 * Fetches the current user's data from the /api/me/ endpoint.
 */
async function fetchUserData() {
  const token = getAuthToken();
  if (!token) {
    console.error('No auth token found. Cannot fetch user.');
    return null;
  }

  try {
    const response = await fetch('/api/me/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Send the token for auth
      }
    });

    if (response.ok) {
      const user = await response.json();
      return user; // Returns { "id": 1, "username": "Zanne", "email": "zanne@gmail.com" }
    } else {
      console.error('Failed to fetch user data:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Renders the Profile page by fetching real user data.
 */
export async function renderProfile(container) {
  // 1. Fetch the real user data from the API
  const user = await fetchUserData();

  // 2. Set the data, with fallbacks just in case
  const userName = user?.username || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  // 3. Dummy valuation data (same as before)
  const recentValuations = []; // We can fetch this later
  
  // Helper to render valuation history items
  function renderHistoryItems() {
    if (recentValuations.length === 0) {
      return `
        <div class="profile-empty-state">
          <svg ...></svg>
          <p>No valuation history yet</p>
          <p class="text-sm">Start by getting your first vehicle valuation</p>
        </div>
      `;
    }
    // ... (rest of your history rendering logic) ...
  }

  // 4. Render the full page with the REAL data
  container.innerHTML = `
    <div class="profile-page-wrapper">
      <div class="container">
        <div class="card profile-header">
          <div class="profile-header-avatar">
            <div class="avatar-fallback">${userInitial}</div>
          </div>
          <div class="profile-header-info">
            <h1 class="profile-header-name">${userName}</h1>
            <p class="profile-header-meta">Member since October 2024</p> <div class="profile-header-badges">
              <span class="badge badge-secondary">Premium Member</span> <span class="badge badge-outline">0 Valuations</span> </div>
          </div>
          </div>

        <div class="profile-tabs">
          <div class="tabs-list">
            <button class="tab-trigger active" data-tab-target="#profile-info">
              <span>Profile Info</span>
            </button>
            <button class="tab-trigger" data-tab-target="#profile-history">
              <span>History</span>
            </button>
          </div>

          <div id="profile-info" class="tab-pane active">
            <div class="profile-grid">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Personal Information</h3>
                  <p class="card-description">Your personal details and contact information</p>
                </div>
                <div class="card-content">
                  
                  <div class="profile-form-group">
                    <label for="fullName" class="form-label">Full Name</label>
                    <div class="input-with-icon">
                      <span class="input-icon">...</span>
                      <input id="fullName" class="form-input with-icon" value="${userName}">
                    </div>
                  </div>
                  
                  <div class="profile-form-group">
                    <label for="email" class="form-label">Email</Slabel>
                    <div class="input-with-icon">
                      <span class="input-icon">...</span>
                      <input id="email" type="email" class="form-input with-icon" value="${userEmail}" readonly>
                    </div>
                  </div>
                  
                  <div class="profile-form-group">
                    <label for="phone" class="form-label">Phone Number</label>
                    <div class="input-with-icon">
                      <span class="input-icon">...</span>
                      <input id="phone" type="tel" class="form-input with-icon" value="+60 12-345 6789">
                    </div>
                  </div>
                  
                  <div class="profile-form-group">
                    <label for="location" class="form-label">Location</label>
                    <div class="input-with-icon">
                      <span class="input-icon">...</span>
                      <input id="location" class="form-input with-icon" value="Cheras, Selangor">
                    </div>
                  </div>
                  
                  <hr class="form-separator" />
                  <button class="btn btn-primary btn-full">Save Changes</button>
                </div>
              </div>

              <div class="card">
                </div>
            </div>
          </div>

          <div id="profile-history" class="tab-pane">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Valuation History</h3>
                <p class="card-description">Your recent vehicle valuations</p>
              </div>
              <div class="card-content">
                <div class="history-list">
                  ${renderHistoryItems()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 5. Re-add the Tab Switching Logic
  const tabTriggers = container.querySelectorAll('.tab-trigger');
  const tabPanes = container.querySelectorAll('.tab-pane');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      tabTriggers.forEach(t => t.classList.remove('active'));
      trigger.classList.add('active');
      const targetId = trigger.getAttribute('data-tab-target');
      tabPanes.forEach(pane => pane.classList.remove('active'));
      container.querySelector(targetId).classList.add('active');
    });
  });
}/**
 * Helper function to get the auth token from localStorage.
 */
function getAuthToken() {
  return localStorage.getItem('accessToken');
}

/**
 * Fetches the current user's data from the /api/me/ endpoint.
 */
async function fetchUserData() {
  const token = getAuthToken();
  if (!token) {
    console.error('No auth token found. Cannot fetch user.');
    return null;
  }

  try {
    const response = await fetch('/api/me/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Send the token for auth
      }
    });

    if (response.ok) {
      const user = await response.json();
      return user; // Returns { "id": 1, "username": "Zanne", "email": "zanne@gmail.com" }
    } else {
      console.error('Failed to fetch user data:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Renders the Profile page by fetching real user data.
 */
export async function renderProfile(container) {
  // 1. Fetch the real user data from the API
  const user = await fetchUserData();

  // 2. Set the data, with fallbacks just in case
  const userName = user?.username || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  // 3. Dummy valuation data (same as before)
  const recentValuations = []; // We can fetch this later
  
  // Helper to render valuation history items
  function renderHistoryItems() {
    if (recentValuations.length === 0) {
      return `
        <div class="profile-empty-state">
          <svg ...></svg>
          <p>No valuation history yet</p>
          <p class="text-sm">Start by getting your first vehicle valuation</p>
        </div>
      `;
    }
    // ... (rest of your history rendering logic) ...
  }

  // 4. Render the full page with the REAL data
  container.innerHTML = `
    <div class="profile-page-wrapper">
      <div class="container">
        <div class="card profile-header">
          <div class="profile-header-avatar">
            <div class="avatar-fallback">${userInitial}</div>
          </div>
          <div class="profile-header-info">
            <h1 class="profile-header-name">${userName}</h1>
            <p class="profile-header-meta">Member since October 2024</p> <div class="profile-header-badges">
              <span class="badge badge-secondary">Premium Member</span> <span class="badge badge-outline">0 Valuations</span> </div>
          </div>
          </div>

        <div class="profile-tabs">
          <div class="tabs-list">
            <button class="tab-trigger active" data-tab-target="#profile-info">
              <span>Profile Info</span>
            </button>
            <button class="tab-trigger" data-tab-target="#profile-history">
              <span>History</span>
            </button>
          </div>

          <div id="profile-info" class="tab-pane active">
            <div class="profile-grid">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Personal Information</h3>
                  <p class="card-description">Your personal details and contact information</p>
                </div>
                <div class="card-content">
                  
                  <div class="profile-form-group">
                    <label for="fullName" class="form-label">Full Name</label>
                    <div class="input-with-icon">
                      <span class="input-icon">...</span>
                      <input id="fullName" class="form-input with-icon" value="${userName}">
                    </div>
                  </div>
                  
                  <div class="profile-form-group">
                    <label for="email" class="form-label">Email</Slabel>
                    <div class="input-with-icon">
                      <span class="input-icon">...</span>
                      <input id="email" type="email" class="form-input with-icon" value="${userEmail}" readonly>
                    </div>
                  </div>
                  
                  <div class="profile-form-group">
                    <label for="phone" class="form-label">Phone Number</label>
                    <div class="input-with-icon">
                      <span class="input-icon">...</span>
                      <input id="phone" type="tel" class="form-input with-icon" value="+60 12-345 6789">
                    </div>
                  </div>
                  
                  <div class="profile-form-group">
                    <label for="location" class="form-label">Location</label>
                    <div class="input-with-icon">
                      <span class="input-icon">...</span>
                      <input id="location" class="form-input with-icon" value="Cheras, Selangor">
                    </div>
                  </div>
                  
                  <hr class="form-separator" />
                  <button class="btn btn-primary btn-full">Save Changes</button>
                </div>
              </div>

              <div class="card">
                </div>
            </div>
          </div>

          <div id="profile-history" class="tab-pane">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Valuation History</h3>
                <p class="card-description">Your recent vehicle valuations</p>
              </div>
              <div class="card-content">
                <div class="history-list">
                  ${renderHistoryItems()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 5. Re-add the Tab Switching Logic
  const tabTriggers = container.querySelectorAll('.tab-trigger');
  const tabPanes = container.querySelectorAll('.tab-pane');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      tabTriggers.forEach(t => t.classList.remove('active'));
      trigger.classList.add('active');
      const targetId = trigger.getAttribute('data-tab-target');
      tabPanes.forEach(pane => pane.classList.remove('active'));
      container.querySelector(targetId).classList.add('active');
    });
  });
}