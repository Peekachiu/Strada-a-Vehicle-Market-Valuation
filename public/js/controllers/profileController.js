import { renderProfilePage, renderProfileHistoryRows, updateProfileStats } from '../views/profileView.js';

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

      // 'userData' is defined HERE, inside the try block
      const userData = await userResponse.json();

      // 2. Render the Layout
      renderProfilePage(this.main, userData);

      // 3. Setup the Edit Modal
      // IMPORTANT: This must be called HERE, while 'userData' is still available
      this.setupEditModal(userData);

      // 4. Fetch History Data (First Page)
      await this.fetchHistory('/api/history/');

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

        // 5. Update the History Tab
        // Pass the whole data object (results, next, previous)
        renderProfileHistoryRows(
          data,
          (nextUrl) => this.fetchHistory(nextUrl),
          (id) => this.handleDeleteValuation(id)
        );

        // 6. Update the Stats Box
        // Use the stats from the backend
        if (data.stats) {
          updateProfileStats(data.stats);
        }
      }
    } catch (error) {
      console.error("History Fetch Error:", error);
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

    // 1. Open Modal
    openBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    // 2. Close Modal (Cancel)
    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // 3. Handle Form Submit
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
}