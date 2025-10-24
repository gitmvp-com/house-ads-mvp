// DOM Elements
const adForm = document.getElementById('ad-form');
const adIdInput = document.getElementById('ad-id');
const adNameInput = document.getElementById('ad-name');
const adHtmlInput = document.getElementById('ad-html');
const visibleLoggedInInput = document.getElementById('visible-logged-in');
const visibleAnonsInput = document.getElementById('visible-anons');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const adsList = document.getElementById('ads-list');
const adDisplay = document.getElementById('ad-display');

let editMode = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadAds();
  loadDisplayAds();
});

// Form submission
adForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const adData = {
    name: adNameInput.value,
    html: adHtmlInput.value,
    visible_to_logged_in_users: visibleLoggedInInput.checked,
    visible_to_anons: visibleAnonsInput.checked
  };
  
  try {
    if (editMode) {
      await updateAd(adIdInput.value, adData);
    } else {
      await createAd(adData);
    }
    
    resetForm();
    loadAds();
    loadDisplayAds();
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Cancel button
cancelBtn.addEventListener('click', () => {
  resetForm();
});

// API Functions
async function loadAds() {
  try {
    const response = await fetch('/api/house-ads');
    const data = await response.json();
    renderAdsList(data.house_ads);
  } catch (error) {
    console.error('Error loading ads:', error);
  }
}

async function createAd(adData) {
  const response = await fetch('/api/house-ads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(adData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create ad');
  }
  
  return response.json();
}

async function updateAd(id, adData) {
  const response = await fetch(`/api/house-ads/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(adData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update ad');
  }
  
  return response.json();
}

async function deleteAd(id) {
  if (!confirm('Are you sure you want to delete this ad?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/house-ads/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete ad');
    }
    
    loadAds();
    loadDisplayAds();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function loadDisplayAds() {
  try {
    const response = await fetch('/api/display/ads');
    const data = await response.json();
    renderDisplayAds(data.ads);
  } catch (error) {
    console.error('Error loading display ads:', error);
  }
}

// Render Functions
function renderAdsList(ads) {
  if (!ads || ads.length === 0) {
    adsList.innerHTML = '<p class="empty-state">No ads created yet. Create your first ad above!</p>';
    return;
  }
  
  adsList.innerHTML = ads.map(ad => `
    <div class="ad-card">
      <div class="ad-card-header">
        <h3 class="ad-card-title">${escapeHtml(ad.name)}</h3>
        <div class="ad-card-actions">
          <button class="btn btn-edit" onclick="editAd(${ad.id})">Edit</button>
          <button class="btn btn-delete" onclick="deleteAd(${ad.id})">Delete</button>
        </div>
      </div>
      <div class="ad-card-content">
        <code>${escapeHtml(ad.html)}</code>
      </div>
      <div class="ad-card-meta">
        <span class="meta-badge ${ad.visible_to_logged_in_users ? 'active' : 'inactive'}">
          ${ad.visible_to_logged_in_users ? '✓' : '✗'} Logged-in users
        </span>
        <span class="meta-badge ${ad.visible_to_anons ? 'active' : 'inactive'}">
          ${ad.visible_to_anons ? '✓' : '✗'} Anonymous users
        </span>
      </div>
    </div>
  `).join('');
}

function renderDisplayAds(ads) {
  if (!ads || ads.length === 0) {
    adDisplay.innerHTML = '<p class="empty-state">No ads to display</p>';
    return;
  }
  
  // Show a random ad (similar to how it would work in production)
  const randomAd = ads[Math.floor(Math.random() * ads.length)];
  adDisplay.innerHTML = randomAd.html;
}

function editAd(id) {
  fetch(`/api/house-ads/${id}`)
    .then(response => response.json())
    .then(data => {
      const ad = data.house_ad;
      
      editMode = true;
      adIdInput.value = ad.id;
      adNameInput.value = ad.name;
      adHtmlInput.value = ad.html;
      visibleLoggedInInput.checked = ad.visible_to_logged_in_users;
      visibleAnonsInput.checked = ad.visible_to_anons;
      
      formTitle.textContent = 'Edit House Ad';
      submitBtn.textContent = 'Update Ad';
      cancelBtn.style.display = 'inline-block';
      
      // Scroll to form
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(error => {
      alert('Error loading ad: ' + error.message);
    });
}

function resetForm() {
  editMode = false;
  adForm.reset();
  adIdInput.value = '';
  formTitle.textContent = 'Create New House Ad';
  submitBtn.textContent = 'Create Ad';
  cancelBtn.style.display = 'none';
  visibleLoggedInInput.checked = true;
  visibleAnonsInput.checked = true;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally available
window.editAd = editAd;
window.deleteAd = deleteAd;
