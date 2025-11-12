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
      // Returns { "id": 1, "username": "YourName", "email": "YourEmail@gmail.com" }
      return user; 
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
  
  // 1. Show a simple loading state
  container.innerHTML = `<div class="container" style="padding: 4rem 0;"><p>Loading profile...</p></div>`;
  
  // 2. Fetch the real user data from the API
  const user = await fetchUserData();

  // 3. If the fetch failed, show an error
  if (!user) {
    container.innerHTML = `<div class="container" style="padding: 4rem 0;"><p>Error loading profile. Please log in again.</p></div>`;
    return;
  }

  // 4. Set the data variables from the fetched user
  const userName = user.username;
  const userEmail = user.email;
  const userPhone = user.phone_number || '';
  const userInitial = userName.charAt(0).toUpperCase();

  // 5. Dummy valuation data (we will make this real later)
  const recentValuations = []; 
  
  // Helper to render valuation history items
  function renderHistoryItems() {
    if (recentValuations.length === 0) {
      return `
        <div class="profile-empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8z"/>
            <circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
          </svg>
          <p>No valuation history yet</p>
          <p class="text-sm">Start by getting your first vehicle valuation</p>
        </div>
      `;
    }
    // ... (rest of your history rendering logic would go here) ...
  }

  // 6. Render the full page HTML with the REAL data
  container.innerHTML = `
    <div class="profile-page-wrapper">
      <div class="container">
        <div class="card profile-header">
          <div class="profile-header-avatar">
            <div class="avatar-fallback">${userInitial}</div>
          </div>
          <div class="profile-header-info">
            <h1 class="profile-header-name">${userName}</h1>
            <p class="profile-header-meta">Member since Oct 2024</p> <div class="profile-header-badges">
              <span class="badge badge-secondary">Premium Member</span> <span class="badge badge-outline">0 Valuations</span> </div>
          </div>
          <button class="btn btn-outline profile-header-edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Edit Profile</span>
          </button>
        </div>

        <div class="profile-tabs">
          <div class="tabs-list">
            <button class="tab-trigger active" data-tab-target="#profile-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Profile Info</span>
            </button>
            <button class="tab-trigger" data-tab-target="#profile-history">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
              </svg>
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
                      <span class="input-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </span>
                      <input id="fullName" class="form-input with-icon" value="${userName}">
                    </div>
                  </div>
                  
                  <div class="profile-form-group">
                    <label for="email" class="form-label">Email</label>
                    <div class="input-with-icon">
                      <span class="input-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </span>
                      <input id="email" type="email" class="form-input with-icon" value="${userEmail}" readonly>
                    </div>
                  </div>
                  
                  <div class="profile-form-group">
                    <label for="phone" class="form-label">Phone Number</label>
                    <div class="input-with-icon">
                      <span class="input-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </span>
                      <input id="phone" type="tel" class="form-input with-icon" value="${userPhone}" placeholder="Add phone number">
                    </div>
                  </div>
                  
                  <div class="profile-form-group">
                    <label for="location" class="form-label">Location</label>
                    <div class="input-with-icon">
                      <span class="input-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                      </span>
                      <input id="location" class="form-input with-icon" value="Cheras, Selangor" placeholder="Add location">
                    </div>
                  </div>
                  
                  <hr class="form-separator" />
                  <button class="btn btn-primary btn-full">Save Changes</button>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Account Statistics</h3>
                  <p class="card-description">Your activity and usage overview</p>
                </div>
                <div class="card-content">
                  </div>
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
  
  // 7. Re-add the Tab Switching Logic
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