const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// This serves all static files in your 'public' folder
// (like .css, .js, and images)
app.use(express.static(path.join(__dirname, 'public')));

// This explicitly tells the server to send 'index.html'
// when someone visits the main root URL ('/')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Your API routes will go here later ---
// app.post('/api/estimate', (req, res) => {
//   // ... logic to handle valuation
// });

app.listen(PORT, () => {
  console.log(`Strada server running at http://localhost:${PORT}`);
});