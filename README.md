# House Ads MVP

> A simplified standalone version of the [discourse/discourse-adplugin](https://github.com/discourse/discourse-adplugin) focusing on the **House Ads** feature - manage and display your own custom HTML advertisements.

## 🎯 What is this?

This MVP extracts the core **House Ads** functionality from Discourse's advertising plugin, allowing you to:

- ✨ Create custom HTML advertisements
- 📝 Edit and manage your ads through a web interface
- 👥 Control visibility (logged-in vs. anonymous users)
- 🎨 Use any HTML/CSS for your ad content
- 📊 Display ads without external ad platforms

## 🚀 Features

The MVP includes:

1. **Ad Management UI** - Create, read, update, and delete house ads
2. **Validation** - Name uniqueness and required fields
3. **Visibility Controls** - Target logged-in or anonymous users
4. **Live Preview** - See how your ads will appear
5. **RESTful API** - JSON API for all ad operations
6. **In-Memory Storage** - Simple storage (no database required for MVP)

## 🛠️ Installation

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/gitmvp-com/house-ads-mvp.git
cd house-ads-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser to:
```
http://localhost:3000
```

## 📖 Usage

### Creating an Ad

1. Fill in the **Ad Name** (e.g., "Summer Sale Banner")
2. Add your **HTML Content** (e.g., `<div class='house-ad'>Special Offer!</div>`)
3. Choose visibility options:
   - ✓ Visible to logged-in users
   - ✓ Visible to anonymous users
4. Click **Create Ad**

### Editing an Ad

1. Click the **Edit** button on any ad card
2. Modify the fields
3. Click **Update Ad**

### Deleting an Ad

1. Click the **Delete** button on any ad card
2. Confirm the deletion

## 🔌 API Reference

The MVP provides a RESTful API:

### Get All Ads
```http
GET /api/house-ads
```

### Get Single Ad
```http
GET /api/house-ads/:id
```

### Create Ad
```http
POST /api/house-ads
Content-Type: application/json

{
  "name": "My Ad",
  "html": "<div>Ad Content</div>",
  "visible_to_logged_in_users": true,
  "visible_to_anons": true
}
```

### Update Ad
```http
PUT /api/house-ads/:id
Content-Type: application/json

{
  "name": "Updated Ad",
  "html": "<div>New Content</div>",
  "visible_to_logged_in_users": true,
  "visible_to_anons": false
}
```

### Delete Ad
```http
DELETE /api/house-ads/:id
```

### Get Display Ads (Public)
```http
GET /api/display/ads
```
Returns only ads visible to anonymous users.

## 🏗️ Architecture

### Backend (Node.js/Express)
- `server.js` - Express server with RESTful API
- In-memory storage (array-based, similar to Discourse's PluginStore)
- Validation matching the original Ruby model

### Frontend (Vanilla JavaScript)
- `public/index.html` - Main UI
- `public/app.js` - Client-side logic (CRUD operations)
- `public/styles.css` - Modern, responsive styling

## 📝 Key Differences from Parent Repository

### Removed Features
- External ad platforms (Google AdSense, DFP, Amazon, Carbon Ads, AdButler)
- Trust level filtering
- Group-based targeting
- Category-based filtering
- Tag-based filtering
- Discourse-specific integrations
- Admin routes and authentication
- Database persistence (using in-memory storage instead)

### Simplified Features
- **House Ads Only** - Focus on custom HTML ads
- **No Authentication** - MVP runs without user login
- **In-Memory Storage** - No database required
- **Single Page App** - Simple UI for CRUD operations
- **Standalone** - No Discourse dependency

## 🔮 Future Enhancements

Potential additions for a full version:

- [ ] Database persistence (SQLite, PostgreSQL)
- [ ] User authentication
- [ ] Ad scheduling (start/end dates)
- [ ] Click tracking and analytics
- [ ] Multiple ad slots (header, sidebar, footer)
- [ ] A/B testing
- [ ] Image upload support
- [ ] Ad templates
- [ ] Responsive preview

## 📦 Dependencies

Based on the parent repository's package.json, this MVP uses:

- **express** (^4.18.2) - Web framework
- **body-parser** (^1.20.2) - JSON request parsing

No build tools required - uses vanilla JavaScript for simplicity.

## 🤝 Contributing

Contributions are welcome! This is an MVP, so there's plenty of room for improvement.

## 📄 License

MIT License - same as the parent repository [discourse/discourse-adplugin](https://github.com/discourse/discourse-adplugin)

## 🙏 Credits

Based on the **House Ads** feature from [discourse/discourse-adplugin](https://github.com/discourse/discourse-adplugin) by:
- Vi Nguyen ([@ladydanger](https://github.com/ladydanger))
- Sarah Ni ([@cyberkoi](https://github.com/cyberkoi))
- The Discourse team

This MVP extracts and simplifies the House Ads functionality for standalone use.

## 🔗 Links

- [Parent Repository](https://github.com/discourse/discourse-adplugin)
- [Discourse Meta Topic](https://meta.discourse.org/t/33734)
- [Original Documentation](https://github.com/discourse/discourse-adplugin#house-ads)

---

**Note**: This is an MVP (Minimum Viable Product) created to demonstrate the House Ads concept in a standalone application. For production use with Discourse, please use the [official plugin](https://github.com/discourse/discourse-adplugin).
