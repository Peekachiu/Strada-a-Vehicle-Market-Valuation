const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// --- This is the only part you need to serve your site ---
// It tells Express to serve all files from the 'public' folder
// and automatically find 'index.html' when someone visits '/'
app.use(express.static(path.join(__dirname, 'public')));

// --- Your API routes will go here later ---
// app.post('/api/estimate', (req, res) => {
//   // ... logic to handle valuation
// });

app.listen(PORT, () => {
  console.log(`Strada server running at http://localhost:${PORT}`);
});