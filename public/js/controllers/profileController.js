import { renderProfilePage, renderProfileHistoryRows } from '../views/profileView.js';

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
      // 1. Fetch User Data (Controller Logic)
      const userResponse = await fetch('/api/me/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!userResponse.ok) throw new Error("Failed to fetch user");
      const userData = await userResponse.json();

      // 2. Render the Layout (View Logic)
      // We pass the data to the View. We do NOT fetch inside the View.
      renderProfilePage(this.main, userData);

      // 3. Fetch History Data (Controller Logic)
      const historyResponse = await fetch('/api/history/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        // 4. Update the History Tab (View Logic)
        renderProfileHistoryRows(historyData);
      }

    } catch (error) {
      console.error("Profile Error:", error);
      this.main.innerHTML = `<p style="text-align:center; padding: 2rem; color: red;">Error loading profile.</p>`;
    }
  }
}