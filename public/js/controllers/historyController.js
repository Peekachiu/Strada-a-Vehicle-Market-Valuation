import { renderHistoryPage, renderHistoryTableRows } from '../views/historyView.js';

export class HistoryController {
  constructor(main) {
    this.main = main;
  }

  async init() {
    // 1. Render the skeleton/loading state
    renderHistoryPage(this.main);

    // 2. Check Auth
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Please log in to view your history.");
      window.location.hash = 'login';
      return;
    }

    // 3. Fetch Data
    try {
      const response = await fetch('/api/history/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const valuations = await response.json();
        // 4. Update the table
        renderHistoryTableRows(valuations);
      } else {
        console.error("Failed to fetch history");
        document.getElementById('history-table-body').innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 1rem; color: red;">Error loading history.</td></tr>`;
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  }
}