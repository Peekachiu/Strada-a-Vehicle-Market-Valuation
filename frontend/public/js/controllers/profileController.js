import { renderProfilePage, renderProfileHistoryRows, updateProfileStats, renderMyVehicles } from '../views/profileView.js';
import { showNotification } from '../utils/notification.js';

export class ProfileController {
  constructor(main) {
    this.main = main;
  }

  async init() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Please login to view your profile.");
      window.location.hash = 'login';
      return;
    }

    try {
      // 1. Fetch User Data
      const userResponse = await fetch('/api/me/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!userResponse.ok) throw new Error("Failed to fetch user");
      const userData = await userResponse.json();

      // 2. Render the Layout
      renderProfilePage(this.main, userData);

      // 3. Setup Modals
      this.setupEditModal(userData);
      this.setupAddVehicleModal();
      this.setupDeleteAccountModal();

      // 4. Fetch Data
      await Promise.all([
        this.fetchHistory('/api/history/'),
        this.fetchVehicles()
      ]);

    } catch (error) {
      console.error("Profile Error:", error);
      this.main.innerHTML = `<p style="text-align:center; padding: 2rem; color: red;">Error loading profile.</p>`;
    }
  }

  async fetchHistory(url) {
    const token = localStorage.getItem('accessToken');
    try {
      const historyResponse = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (historyResponse.ok) {
        const data = await historyResponse.json();
        renderProfileHistoryRows(
          data,
          (nextUrl) => this.fetchHistory(nextUrl),
          (id) => this.handleDeleteValuation(id)
        );
        if (data.stats) updateProfileStats(data.stats);
      }
    } catch (error) {
      console.error("History Fetch Error:", error);
    }
  }

  async fetchVehicles() {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch('/api/vehicles/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const vehicles = await res.json();
        renderMyVehicles(vehicles, (id) => this.handleDeleteVehicle(id));
      }
    } catch (err) {
      console.error("Fetch Vehicles Error:", err);
    }
  }

  async handleAddVehicle(formData) {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch('/api/vehicles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Vehicle added successfully!");
        document.getElementById('add-vehicle-modal').style.display = 'none';
        this.fetchVehicles(); // Refresh list
      } else {
        alert("Failed to add vehicle.");
      }
    } catch (err) {
      console.error("Add Vehicle Error:", err);
    }
  }

  async handleDeleteVehicle(id) {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`/api/vehicles/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        this.fetchVehicles();
      } else {
        alert("Failed to delete vehicle.");
      }
    } catch (err) {
      console.error("Delete vehicle error:", err);
    }
  }

  async handleDeleteValuation(id) {
    if (!confirm("Are you sure you want to delete this valuation? This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`/api/history/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        // Reload history (page 1) to reflect changes
        this.fetchHistory('/api/history/');
      } else {
        alert("Failed to delete valuation.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("An error occurred while deleting.");
    }
  }

  setupEditModal(currentUser) {
    const modal = document.getElementById('edit-profile-modal');
    const openBtn = document.getElementById('open-edit-modal');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const form = document.getElementById('edit-profile-form');

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', () => modal.style.display = 'block');
    cancelBtn.addEventListener('click', () => modal.style.display = 'none');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // --- VALIDATION START ---

      // 1. Phone Number Validation
      let phone = data.phone_number_write;
      if (phone) {
        // Remove spaces
        phone = phone.replace(/\s/g, '');

        if (!/^(\+)?\d+$/.test(phone)) {
          showNotification('Phone number must contain only digits (and optional leading +).', 'error');
          return;
        }
        if (phone.length < 9 || phone.length > 15) {
          showNotification('Phone number length is invalid.', 'error');
          return;
        }
        // Auto-format prefix
        if (!phone.startsWith('+')) {
          if (phone.startsWith('60') && phone.length > 9) {
            phone = '+' + phone;
          } else {
            phone = '+60' + phone;
          }
        }
        data.phone_number_write = phone; // Update data with formatted phone
      }

      // 2. Password Validation (Only if provided)
      if (data.password) {
        const password = data.password;
        if (password.length < 8) {
          showNotification('New password must be at least 8 characters long.', 'error');
          return;
        }
        if (!/[A-Z]/.test(password)) {
          showNotification('New password must contain at least one uppercase letter.', 'error');
          return;
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
          showNotification('New password must contain at least one special character.', 'error');
          return;
        }
      } else {
        delete data.password; // Remove empty password so it doesn't overwrite
      }
      // --- VALIDATION END ---

      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('/api/me/', {
          method: 'PUT', // Use PUT for updates
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          showNotification("Profile updated successfully!", "success");
          modal.style.display = 'none';
          this.init(); // Reload the page to show changes
        } else {
          const err = await response.json();
          console.error(err);
          let errMsg = "Failed to update.";
          if (err.detail) errMsg = err.detail;
          else if (err.error) errMsg = err.error;
          else if (err.old_password) errMsg = err.old_password[0]; // Specific common error
          else if (typeof err === 'object') {
            // Try to grab the first error message available
            const keys = Object.keys(err);
            if (keys.length > 0) errMsg = `${keys[0]}: ${err[keys[0]]}`;
          }
          showNotification(errMsg, "error");
        }
      } catch (error) {
        console.error("Update error:", error);
        showNotification("An error occurred while updating.", "error");
      }
    });
  }

  setupAddVehicleModal() {
    const modal = document.getElementById('add-vehicle-modal');
    const openBtn = document.getElementById('open-add-vehicle-modal');
    const cancelBtn = document.getElementById('cancel-add-vehicle-btn');
    const form = document.getElementById('add-vehicle-form');

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', () => modal.style.display = 'block');
    cancelBtn.addEventListener('click', () => modal.style.display = 'none');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      await this.handleAddVehicle(data);
      form.reset();
    });
  }

  setupDeleteAccountModal() {
    const modal = document.getElementById('delete-account-modal');
    const openBtn = document.getElementById('open-delete-account-modal');
    const cancelBtn = document.getElementById('cancel-delete-account-btn');
    const form = document.getElementById('delete-account-form');

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', () => modal.style.display = 'block');
    cancelBtn.addEventListener('click', () => modal.style.display = 'none');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const password = formData.get('confirm_password');

      if (!password) {
        showNotification('Please enter your password.', 'error');
        return;
      }

      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/me/', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ password })
        });

        if (res.status === 204) {
          showNotification('Account deleted successfully. Goodbye!', 'success');
          // Logout logic
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          // Redirect
          setTimeout(() => {
            window.location.href = '#home'; // Or wherever handled
            window.location.reload(); // Force full reload to reset app state
          }, 1500);
        } else {
          const data = await res.json();
          showNotification(data.error || 'Failed to delete account.', 'error');
        }
      } catch (error) {
        console.error('Delete Account Error:', error);
        showNotification('An error occurred during deletion.', 'error');
      }
    });
  }
}