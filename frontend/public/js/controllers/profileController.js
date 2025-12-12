import { renderProfilePage, renderProfileHistoryRows, updateProfileStats, renderMyVehicles } from '../views/profileView.js';

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

      // Remove empty password so it doesn't overwrite with blank
      if (!data.password) delete data.password;

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
          alert("Profile updated successfully!");
          modal.style.display = 'none';
          this.init(); // Reload the page to show changes
        } else {
          const err = await response.json();
          console.error(err);
          alert("Failed to update: " + JSON.stringify(err));
        }
      } catch (error) {
        console.error("Update error:", error);
        alert("An error occurred while updating.");
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
}