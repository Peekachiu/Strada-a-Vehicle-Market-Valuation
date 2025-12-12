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
          <button id="open-delete-account-modal" style="padding: 0.5rem 1rem; background: #fee2e2; border: 1px solid #fecaca; border-radius: 6px; color: #dc2626; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; transition: all 0.2s;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            Delete Account
          </button>
        </div>

        <div class="profile-tabs">
          <div class="tabs-list" style="display: flex; gap: 1rem; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.5rem;">
            <button class="tab-trigger active" data-tab-target="#profile-info" style="padding: 0.75rem 1rem; background: none; border: none; border-bottom: 2px solid #3b82f6; color: #3b82f6; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
              <span>Profile Info</span>
            </button>
            <button class="tab-trigger" data-tab-target="#profile-history" style="padding: 0.75rem 1rem; background: none; border: none; border-bottom: 2px solid transparent; color: #6b7280; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
              <span>Valuation History</span>
            </button>
            <button class="tab-trigger" data-tab-target="#my-vehicles" style="padding: 0.75rem 1rem; background: none; border: none; border-bottom: 2px solid transparent; color: #6b7280; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
              <span>My Vehicles</span>
            </button>
          </div>

          <!-- Profile Info Tab -->
          <div id="profile-info" class="tab-pane active" style="display: block;">
            <!-- ... (Keep existing Profile Info content) ... -->
            <div class="profile-grid" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
              
              <div class="card" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                  <div>
                    <h3 class="card-title" style="margin: 0; color: #1f2937; font-size: 1.1rem; font-weight: 700;">Personal Information</h3>
                    <p class="card-description" style="margin: 0.25rem 0 0; color: #6b7280; font-size: 0.85rem;">Your details and contact info</p>
                  </div>
                  <button id="open-edit-modal" class="btn btn-outline" style="padding: 0.4rem 0.8rem; border: 1px solid #d1d5db; border-radius: 6px; background: white; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Edit
                  </button>
                </div>
                
                <div class="card-content" style="display: grid; gap: 1.25rem;">
                  <div class="profile-form-group">
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Full Name</label>
                    <input value="${displayName}" readonly style="width: 100%; padding: 0.6rem; border: 1px solid #e5e7eb; border-radius: 6px; background: #f9fafb; color: #6b7280;">
                  </div>
                  
                  <div class="profile-form-group">
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Email</label>
                    <input value="${userEmail}" readonly style="width: 100%; padding: 0.6rem; border: 1px solid #e5e7eb; border-radius: 6px; background: #f9fafb; color: #6b7280;">
                  </div>
                  
                  <div class="profile-form-group">
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Phone Number</label>
                    <input value="${userPhone}" readonly style="width: 100%; padding: 0.6rem; border: 1px solid #e5e7eb; border-radius: 6px; background: #f9fafb; color: #6b7280;">
                  </div>
                </div>
              </div>

              <div class="card" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: fit-content;">
                <div class="card-header" style="margin-bottom: 1.5rem;">
                  <h3 class="card-title" style="margin: 0; color: #1f2937; font-size: 1.1rem; font-weight: 700;">Account Summary</h3>
                  <p class="card-description" style="margin: 0.25rem 0 0; color: #6b7280; font-size: 0.85rem;">Your activity overview</p>
                </div>
                <div id="account-stats-content" style="display: flex; gap: 1rem; flex-direction: column;">
                    <div style="padding: 1rem; background: #f9fafb; border-radius: 6px; text-align: center; color: #6b7280; font-size: 0.9rem;">
                        Loading stats...
                    </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Valuation History Tab -->
          <div id="profile-history" class="tab-pane" style="display: none;">
            <div class="card" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div id="history-list-container">
                <p style="text-align: center; color: #6b7280; padding: 2rem;">Loading history...</p>
              </div>
            </div>
          </div>

          <!-- My Vehicle Tab -->
          <div id="my-vehicles" class="tab-pane" style="display: none;">
             <div class="card" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                  <h3 class="card-title" style="margin: 0; color: #1f2937; font-size: 1.1rem; font-weight: 700;">My Vehicles</h3>
                  <button id="open-add-vehicle-modal" style="padding: 0.5rem 1rem; background: #3b82f6; border: none; border-radius: 6px; color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Vehicle
                  </button>
               </div>
               <div id="my-vehicles-list-container">
                 <p style="text-align: center; color: #6b7280; padding: 2rem;">Loading vehicles...</p>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div id="edit-profile-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000;">
      <!-- ... (Keep Edit Profile Modal) ... -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);"></div>
      <div class="modal-content" style="position: relative; background: white; width: 90%; max-width: 500px; margin: 5vh auto; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
        <h2 style="margin-top: 0; margin-bottom: 1.5rem; color: #1f2937;">Edit Profile</h2>
        <form id="edit-profile-form">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Full Name</label>
            <input name="full_name" value="${displayName}" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Email Address</label>
            <input name="email" type="email" value="${userEmail}" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Phone Number</label>
            <input name="phone_number_write" value="${userPhone}" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
          </div>
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">New Password (Optional)</label>
            <input name="password" type="password" placeholder="Leave blank to keep current" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
          </div>
          <div style="margin-bottom: 1.5rem; padding-top: 1rem; border-top: 1px solid #f3f4f6;">
            <label style="display: block; font-size: 0.875rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem;">
              Confirm Current Password <span style="color: red;">*</span>
            </label>
            <input name="old_password" type="password" required placeholder="Enter current password to save" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; background: #fffbeb; border-color: #fcd34d;">
            <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">Security check required for all updates.</p>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button type="button" id="cancel-edit-btn" style="padding: 0.75rem 1.5rem; background: #f3f4f6; border: none; border-radius: 6px; color: #374151; font-weight: 600; cursor: pointer;">Cancel</button>
            <button type="submit" style="padding: 0.75rem 1.5rem; background: #3b82f6; border: none; border-radius: 6px; color: white; font-weight: 600; cursor: pointer;">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Vehicle Modal -->
    <div id="add-vehicle-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000;">
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);"></div>
      <div class="modal-content" style="position: relative; background: white; width: 90%; max-width: 500px; margin: 5vh auto; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-height: 90vh; overflow-y: auto;">
        <h2 style="margin-top: 0; margin-bottom: 1.5rem; color: #1f2937;">Add My Vehicle</h2>
        <form id="add-vehicle-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
             <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Make</label>
                <input name="make" required placeholder="e.g. Honda" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
             </div>
             <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Model</label>
                <input name="model" required placeholder="e.g. Civic" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
             </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
             <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Year</label>
                <input name="year" type="number" required placeholder="e.g. 2020" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
             </div>
             <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Mileage (km)</label>
                <input name="mileage" type="number" required placeholder="e.g. 50000" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
             </div>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 1rem 0;">
          <h4 style="margin: 0 0 1rem; color: #4b5563; font-size: 0.9rem;">Maintenance Info (Optional)</h4>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
             <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Last Service Date</label>
                <input name="last_service_date" type="date" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
             </div>
             <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Last Service Mileage</label>
                <input name="last_service_mileage" type="number" placeholder="km" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
             </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
             <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Repair History / Notes</label>
             <textarea name="repair_history" rows="3" placeholder="e.g. Engine rebuilt in 2023, new tires..." class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-family: inherit;"></textarea>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button type="button" id="cancel-add-vehicle-btn" style="padding: 0.75rem 1.5rem; background: #f3f4f6; border: none; border-radius: 6px; color: #374151; font-weight: 600; cursor: pointer;">Cancel</button>
            <button type="submit" style="padding: 0.75rem 1.5rem; background: #3b82f6; border: none; border-radius: 6px; color: white; font-weight: 600; cursor: pointer;">Add Vehicle</button>
          </div>
        </form>
      </div>
    </div>
 
     <!-- Delete Account Confirmation Modal -->
    <div id="delete-account-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1050;">
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);"></div>
      <div class="modal-content" style="position: relative; background: white; width: 90%; max-width: 450px; margin: 10vh auto; padding: 2rem; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #fee2e2;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="width: 50px; height: 50px; background: #fee2e2; color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h2 style="margin: 0; color: #1f2937; font-size: 1.5rem;">Delete Account?</h2>
            <p style="margin: 0.5rem 0 0; color: #6b7280; line-height: 1.5;">
                This action is <strong style="color: #dc2626;">irreversible</strong>. Please enter your password to confirm deletion.
            </p>
        </div>
        
        <form id="delete-account-form">
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Password</label>
            <input name="confirm_password" type="password" required placeholder="Enter your password" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;">
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <button type="button" id="cancel-delete-account-btn" style="padding: 0.75rem; background: white; border: 1px solid #d1d5db; border-radius: 6px; color: #374151; font-weight: 600; cursor: pointer;">Cancel</button>
            <button type="submit" style="padding: 0.75rem; background: #dc2626; border: none; border-radius: 6px; color: white; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);">Delete Forever</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // 3. Attach Tab Switching Logic (Kept same)
  const tabTriggers = container.querySelectorAll('.tab-trigger');
  const tabPanes = container.querySelectorAll('.tab-pane');

  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      tabTriggers.forEach(t => {
        t.classList.remove('active');
        t.style.color = '#6b7280';
        t.style.borderBottomColor = 'transparent';
      });
      tabPanes.forEach(pane => pane.style.display = 'none');
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
export function renderProfileHistoryRows(data, onNavigate, onDelete) {
  const container = document.getElementById('history-list-container');
  if (!container) return;

  const valuations = data.results || [];

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
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-weight: 700; color: #059669; font-size: 1.1rem;">${price}</span>
                <button class="delete-valuation-btn" data-id="${val.id}" style="background: none; border: none; cursor: pointer; color: #ef4444; padding: 0.25rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        `;
  }).join('');

  // Pagination Controls
  let paginationHTML = '';
  if (data.next || data.previous) {
    paginationHTML = `
        <div style="display: flex; justify-content: space-between; padding: 1rem; border-top: 1px solid #e5e7eb;">
            <button id="prev-page-btn" ${!data.previous ? 'disabled' : ''} style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 6px; background: ${!data.previous ? '#f3f4f6' : 'white'}; color: ${!data.previous ? '#9ca3af' : '#374151'}; cursor: ${!data.previous ? 'not-allowed' : 'pointer'};">
                Previous
            </button>
            <button id="next-page-btn" ${!data.next ? 'disabled' : ''} style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 6px; background: ${!data.next ? '#f3f4f6' : 'white'}; color: ${!data.next ? '#9ca3af' : '#374151'}; cursor: ${!data.next ? 'not-allowed' : 'pointer'};">
                Next
            </button>
        </div>
        `;
  }

  container.innerHTML = `<div style="border: 1px solid #e5e7eb; border-radius: 8px;">${listHTML}${paginationHTML}</div>`;

  // Attach Event Listeners
  if (data.previous) {
    document.getElementById('prev-page-btn').addEventListener('click', () => onNavigate(data.previous));
  }
  if (data.next) {
    document.getElementById('next-page-btn').addEventListener('click', () => onNavigate(data.next));
  }

  // Attach Delete Listeners
  const deleteBtns = container.querySelectorAll('.delete-valuation-btn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      onDelete(id);
    });
    // Add hover effect
    btn.addEventListener('mouseenter', () => btn.style.background = '#fee2e2');
    btn.addEventListener('mouseleave', () => btn.style.background = 'none');
  });
}

/**
 * Updates the Account Summary card with real statistics calculated from history.
 */
export function updateProfileStats(stats) {
  // 1. Find the container (we need to add an ID to the summary card first, see Step 2)
  const container = document.getElementById('account-stats-content');
  if (!container) return;

  // 2. Use Stats from Backend
  const totalCount = stats.total_count || 0;

  // Format Currency
  const totalValue = new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0
  }).format(stats.total_value || 0);

  // 3. Render
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div style="padding: 1rem; background: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd; text-align: center;">
            <span style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #0369a1; margin-bottom: 0.25rem;">Status</span>
            <span style="font-weight: 700; color: #0c4a6e; font-size: 1.1rem;">Active</span>
        </div>

        <div style="padding: 1rem; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center;">
            <span style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #15803d; margin-bottom: 0.25rem;">Valuations</span>
            <span style="font-weight: 700; color: #14532d; font-size: 1.1rem;">${totalCount}</span>
        </div>
    </div>

    <div style="margin-top: 1rem; padding: 1rem; background: #fffbeb; border-radius: 8px; border: 1px solid #fde68a; text-align: center;">
        <span style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #b45309; margin-bottom: 0.25rem;">Total Value Tracked</span>
        <span style="font-weight: 700; color: #78350f; font-size: 1.25rem;">${totalValue}</span>
    </div>
  `;
}

/**
 * Renders the My Vehicles list.
 */
export function renderMyVehicles(vehicles, onDelete) {
  const container = document.getElementById('my-vehicles-list-container');
  if (!container) return;

  if (!vehicles || vehicles.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 3rem 1rem; color: #9ca3af;">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem; color: #4b5563;">No vehicles added yet</p>
        <p class="text-sm">Add your car details to track maintenance and history.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = vehicles.map(v => {
    const nextService = v.next_service_date
      ? new Date(v.next_service_date).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'Not Scheduled';

    const lastService = v.last_service_date
      ? new Date(v.last_service_date).toLocaleDateString('en-MY')
      : 'N/A';

    return `
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; background: #f9fafb;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
           <div>
              <h4 style="margin: 0; font-size: 1.1rem; color: #1f2937; font-weight: 700;">${v.year} ${v.make} ${v.model}</h4>
              <p style="margin: 0.25rem 0 0; color: #6b7280; font-size: 0.9rem;">${v.mileage.toLocaleString()} km</p>
           </div>
           <button class="delete-vehicle-btn" data-id="${v.id}" style="color: #ef4444; background: white; border: 1px solid #fee2e2; padding: 0.4rem; border-radius: 6px; cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
           </button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
           <div>
              <span style="display: block; font-size: 0.75rem; color: #6b7280; text-transform: uppercase;">Last Service</span>
              <span style="font-weight: 600; color: #374151;">${lastService}</span>
           </div>
           <div>
              <span style="display: block; font-size: 0.75rem; color: #6b7280; text-transform: uppercase;">Next Service (Est.)</span>
              <span style="font-weight: 600; color: #059669;">${nextService}</span>
           </div>
        </div>
        ${v.repair_history ? `<div style="margin-top: 0.75rem; font-size: 0.85rem; color: #4b5563; background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #f3f4f6;"><strong>Notes:</strong> ${v.repair_history}</div>` : ''}
      </div>
      `;
  }).join('');

  // Attach delete listeners
  container.querySelectorAll('.delete-vehicle-btn').forEach(btn => {
    btn.addEventListener('click', () => onDelete(btn.getAttribute('data-id')));
  });
}