/**
 * Renders the Profile page.
 * We'll use dummy data just like the Figma sample.
 */
export function renderProfile(container, user) {
  // Use dummy user data if not logged in (for testing)
  const userName = user?.displayName || 'John Doe';
  const userEmail = user?.email || 'john.doe@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  // Dummy valuation data from your Figma
  const recentValuations = [
    { id: 1, vehicle: '2020 Toyota Camry', date: 'Oct 10, 2025', value: 28500, status: 'Completed' },
    { id: 2, vehicle: '2019 Honda Accord', date: 'Oct 5, 2025', value: 25800, status: 'Completed' },
    { id: 3, vehicle: '2021 Ford F-150', date: 'Sep 28, 2025', value: 42000, status: 'Completed' }
  ];

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
    
    return recentValuations.map(val => `
      <div class="history-item">
        <div class="history-item-left">
          <div class="history-item-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8z"/>
              <circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
            </svg>
          </div>
          <div>
            <p class="history-item-vehicle">${val.vehicle}</p>
            <p class="history-item-date">${val.date}</p>
          </div>
        </div>
        <div class="history-item-right">
          <p class="history-item-value">$${val.value.toLocaleString()}</p>
          <span class="badge history-item-badge">${val.status}</span>
        </div>
      </div>
    `).join('');
  }

  container.innerHTML = `
    <div class="profile-page-wrapper">
      <div class="container">
        <!-- Profile Header -->
        <div class="card profile-header">
          <div class="profile-header-avatar">
            <div class="avatar-fallback">${userInitial}</div>
            <!-- <img src="" alt="User" class="avatar-image"> -->
          </div>
          <div class="profile-header-info">
            <h1 class="profile-header-name">${userName}</h1>
            <p class="profile-header-meta">Member since October 2024</p>
            <div class="profile-header-badges">
              <span class="badge badge-secondary">Premium Member</span>
              <span class="badge badge-outline">3 Valuations</span>
            </div>
          </div>
          <button class="btn btn-outline profile-header-edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Edit Profile</span>
          </button>
        </div>

        <!-- Profile Tabs -->
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

          <!-- Profile Info Tab Content -->
          <div id="profile-info" class="tab-pane active">
            <div class="profile-grid">
              <!-- Personal Info Card -->
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
                      <input id="email" type="email" class="form-input with-icon" value="${userEmail}">
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
                      <input id="phone" type="tel" class="form-input with-icon" value="+60 12-345 6789">
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
                      <input id="location" class="form-input with-icon" value="Cheras, Selangor">
                    </div>
                  </div>
                  <hr class="form-separator" />
                  <button class="btn btn-primary btn-full">Save Changes</button>
                </div>
              </div>

              <!-- Account Stats Card -->
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Account Statistics</h3>
                  <p class="card-description">Your activity and usage overview</p>
                </div>
                <div class="card-content">
                  <div class="stat-box">
                    <div class="stat-box-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8z"/>
                        <circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
                      </svg>
                    </div>
                    <div>
                      <p class="stat-box-label">Total Valuations</p>
                      <p class="stat-box-value">3</p>
                    </div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-box-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/>
                        <line x1="3" x2="21" y1="10" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <p class="stat-box-label">Member Since</p>
                      <p class="stat-box-value">Oct 2024</p>
                    </div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-box-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
                      </svg>
                    </div>
                    <div>
                      <p class="stat-box-label">Last Valuation</p>
                      <p class="stat-box-value">3 days ago</p>
                    </div>
                  </div>

                  <hr class="form-separator" />
                  
                  <div class="premium-box">
                    <h4 class="premium-title">Premium Benefits</h4>
                    <ul class="premium-list">
                      <li>
                        <span class="premium-bullet"></span> Unlimited valuations
                      </li>
                      <li>
                        <span class="premium-bullet"></span> Priority support
                      </li>
                      <li>
                        <span class="premium-bullet"></span> Advanced analytics
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- History Tab Content -->
          <div id="profile-history" class="tab-pane">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Valuation History</h3>
                <p class="card-description">Your recent vehicle valuations and saved searches</p>
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
  
  // --- Add Tab Switching Logic ---
  const tabTriggers = container.querySelectorAll('.tab-trigger');
  const tabPanes = container.querySelectorAll('.tab-pane');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      // Remove 'active' from all triggers
      tabTriggers.forEach(t => t.classList.remove('active'));
      // Add 'active' to the clicked one
      trigger.classList.add('active');
      
      const targetId = trigger.getAttribute('data-tab-target');
      
      // Hide all panes
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
      });
      
      // Show the target pane
      container.querySelector(targetId).classList.add('active');
    });
  });
}