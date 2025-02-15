const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/index.html'));
});

// Handle blog routes
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/blog/index.html'));
});

// Handle blog post routes
app.get('/blog/:post', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/blog/post-template.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 