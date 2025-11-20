/**
 * Renders the Profile page structure and User Data.
 * Note: Data is passed in from the Controller, not fetched here.
 */
export function renderProfilePage(container, user) {
  // 1. Prepare User Data
  const userName = user.username || "User"; // Fallback if fields are missing
  const userEmail = user.email;
  const userPhone = user.phone_number || 'Not set'; 
  const userInitial = userName.charAt(0).toUpperCase();
  const dateJoined = user.date_joined
    ? new Date(user.date_joined).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';
  let displayName = user.username;
  if (user.first_name || user.last_name) {
    displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }

  // 2. Render the full page HTML
  container.innerHTML = `
    <div class="profile-page-wrapper">
      <div class="container" style="padding-top: 2rem;">
        
        <div class="card profile-header" style="display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 2rem;">
          <div class="profile-header-avatar">
            <div class="avatar-fallback" style="width: 64px; height: 64px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;">${userInitial}</div>
          </div>
          <div class="profile-header-info" style="flex: 1;">
            <h1 class="profile-header-name" style="margin: 0; font-size: 1.5rem; color: #1f2937;">${displayName}</h1>
            <p class="profile-header-meta" style="margin: 0.25rem 0 0.5rem; color: #6b7280;">Member since ${dateJoined}</p> 
            <div class="profile-header-badges">
              <span class="badge badge-secondary" style="background: #e0f2fe; color: #0369a1; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">Premium Member</span> 
            </div>
          </div>
        </div>

        <div class="profile-tabs">
          <div class="tabs-list" style="display: flex; gap: 1rem; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.5rem;">
            <button class="tab-trigger active" data-tab-target="#profile-info" style="padding: 0.75rem 1rem; background: none; border: none; border-bottom: 2px solid #3b82f6; color: #3b82f6; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
              <span>Profile Info</span>
            </button>
            <button class="tab-trigger" data-tab-target="#profile-history" style="padding: 0.75rem 1rem; background: none; border: none; border-bottom: 2px solid transparent; color: #6b7280; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
              <span>Valuation History</span>
            </button>
          </div>

          <div id="profile-info" class="tab-pane active" style="display: block;">
            <div class="card" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="margin-top: 0; margin-bottom: 1.5rem; color: #1f2937;">Personal Information</h3>
              
              <div style="display: grid; gap: 1.5rem;">
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Full Name</label>
                    <input value="${displayName}" readonly style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #f9fafb;">
                </div>
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Email</label>
                    <input value="${userEmail}" readonly style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #f9fafb;">
                </div>
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Phone</label>
                    <input value="${userPhone}" readonly style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #f9fafb;" placeholder="Not set">
                </div>
              </div>
            </div>
          </div>

          <div id="profile-history" class="tab-pane" style="display: none;">
            <div class="card" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div id="history-list-container">
                <p style="text-align: center; color: #6b7280; padding: 2rem;">Loading history...</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
  
  // 3. Attach Tab Switching Logic
  const tabTriggers = container.querySelectorAll('.tab-trigger');
  const tabPanes = container.querySelectorAll('.tab-pane');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      // Reset all
      tabTriggers.forEach(t => {
          t.classList.remove('active');
          t.style.color = '#6b7280';
          t.style.borderBottomColor = 'transparent';
      });
      tabPanes.forEach(pane => pane.style.display = 'none');
      
      // Activate clicked
      trigger.classList.add('active');
      trigger.style.color = '#3b82f6';
      trigger.style.borderBottomColor = '#3b82f6';
      
      const targetId = trigger.getAttribute('data-tab-target');
      container.querySelector(targetId).style.display = 'block';
    });
  });
}

/**
 * Updates the History Tab with the list of valuations.
 * Called by the Controller after fetching data.
 */
export function renderProfileHistoryRows(valuations) {
    const container = document.getElementById('history-list-container');
    if (!container) return;

    // Empty State (Your original SVG design)
    if (!valuations || valuations.length === 0) {
        container.innerHTML = `
         <div class="profile-empty-state" style="text-align: center; padding: 3rem 1rem; color: #9ca3af;">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.5;">
             <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8z"/>
             <circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
           </svg>
           <p style="font-size: 1.1rem; margin-bottom: 0.5rem; color: #4b5563;">No valuation history yet</p>
           <p class="text-sm">Start by getting your first vehicle valuation</p>
         </div>
        `;
        return;
    }

    // Render List of Items
    const listHTML = valuations.map(val => {
        const price = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(val.predicted_price);
        const date = new Date(val.created_at).toLocaleDateString('en-MY');
        
        return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #f3f4f6;">
            <div>
                <h4 style="margin: 0; font-size: 1rem; color: #1f2937;">${val.year} ${val.make} ${val.model}</h4>
                <p style="margin: 0.25rem 0 0; font-size: 0.85rem; color: #6b7280;">${val.mileage.toLocaleString()} km • ${date}</p>
            </div>
            <div style="text-align: right;">
                <span style="font-weight: 700; color: #059669; font-size: 1.1rem;">${price}</span>
            </div>
        </div>
        `;
    }).join('');

    container.innerHTML = `<div style="border: 1px solid #e5e7eb; border-radius: 8px;">${listHTML}</div>`;
}