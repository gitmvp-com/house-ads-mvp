const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for house ads (similar to PluginStore in Discourse)
let houseAds = [];
let nextId = 1;

// Routes

// Get all house ads
app.get('/api/house-ads', (req, res) => {
  res.json({ house_ads: houseAds });
});

// Get single house ad
app.get('/api/house-ads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ad = houseAds.find(a => a.id === id);
  
  if (ad) {
    res.json({ house_ad: ad });
  } else {
    res.status(404).json({ error: 'House ad not found' });
  }
});

// Create house ad
app.post('/api/house-ads', (req, res) => {
  const { name, html, visible_to_logged_in_users, visible_to_anons } = req.body;
  
  // Validation
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (!html || !html.trim()) {
    return res.status(400).json({ error: 'HTML content is required' });
  }
  
  // Check for duplicate names
  const nameExists = houseAds.some(ad => ad.name.toLowerCase() === name.toLowerCase());
  if (nameExists) {
    return res.status(400).json({ error: 'Name already exists' });
  }
  
  const newAd = {
    id: nextId++,
    name: name.trim(),
    html: html.trim(),
    visible_to_logged_in_users: visible_to_logged_in_users !== false,
    visible_to_anons: visible_to_anons !== false
  };
  
  houseAds.push(newAd);
  res.status(201).json({ house_ad: newAd });
});

// Update house ad
app.put('/api/house-ads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const adIndex = houseAds.findIndex(a => a.id === id);
  
  if (adIndex === -1) {
    return res.status(404).json({ error: 'House ad not found' });
  }
  
  const { name, html, visible_to_logged_in_users, visible_to_anons } = req.body;
  
  // Validation
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (!html || !html.trim()) {
    return res.status(400).json({ error: 'HTML content is required' });
  }
  
  // Check for duplicate names (excluding current ad)
  const nameExists = houseAds.some(ad => 
    ad.id !== id && ad.name.toLowerCase() === name.toLowerCase()
  );
  if (nameExists) {
    return res.status(400).json({ error: 'Name already exists' });
  }
  
  houseAds[adIndex] = {
    id,
    name: name.trim(),
    html: html.trim(),
    visible_to_logged_in_users: visible_to_logged_in_users !== false,
    visible_to_anons: visible_to_anons !== false
  };
  
  res.json({ house_ad: houseAds[adIndex] });
});

// Delete house ad
app.delete('/api/house-ads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const adIndex = houseAds.findIndex(a => a.id === id);
  
  if (adIndex === -1) {
    return res.status(404).json({ error: 'House ad not found' });
  }
  
  houseAds.splice(adIndex, 1);
  res.json({ success: true });
});

// Get ads for display (anonymous users)
app.get('/api/display/ads', (req, res) => {
  const visibleAds = houseAds.filter(ad => ad.visible_to_anons);
  res.json({ ads: visibleAds });
});

app.listen(PORT, () => {
  console.log(`House Ads MVP server running on http://localhost:${PORT}`);
});
