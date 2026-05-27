# Warrantour — Frontend

A full-stack warranty tracking web application. Register products, attach receipts, and monitor warranty expiry dates — all from a clean, responsive dashboard.

**Live:** https://warrantyproject.greymansshop.dk

**Test credentials for deployed website:**  

Email: Shay@gmail.com 

Password: Sayyes4312

**Portfolio Site:** https://dannyshayh.github.io/Portfolio/posts/warranty_frontend/frontend/

---

## Tech Stack

- **React 19** — UI framework
- **React Router v7** — client-side routing
- **Vite 8** — build tool
- **CSS Modules** — scoped component styling
- **jwt-decode** — token inspection (not verification)

---

## Features

- JWT authentication — register, login, logout
- Case-insensitive email login
- Add products with warranty duration, purchase date, retailer and price
- Warranty expiry tracking with colour-coded time left badges
- Search, filter and sort your warranty list
- Click any product to view details in an overlay
- Two-step delete confirmation
- Responsive design — works on mobile, tablet and desktop
- Deployed to Digital Ocean via `scp` and served by Caddy

---

## Project Structure

```
src/
  context/
    AuthContext.js        ← global auth + product state (useAuth hook)
  components/
    TopNav.jsx            ← sticky nav with user chip and logout
    WarrantyTable.jsx     ← product list with filtering, sorting, detail overlay
    CardStack.jsx         ← animated demo cards on the landing page
    ui.jsx                ← shared primitives (PillButton, Field, Input, Footer etc)
  layouts/
    RootLayout.jsx        ← outlet wrapper with TopNav, Footer and go() navigation
  pages/
    PageIndex.jsx         ← landing page
    PageLogin.jsx         ← login form
    PageSignUp.jsx        ← registration form with password strength meter
    PageRegister.jsx      ← add a new product
    PageProfile.jsx       ← warranty dashboard
    PageContact.jsx       ← contact form
  styles/
    global.css            ← CSS variables, reset, animations
    Page.module.css       ← shared page wrapper styles
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A running instance of the [Warrantour backend](https://github.com/DannyShayH/WarrantyProject)

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

By default the API URL points to the deployed backend. To use a local backend, swap the `API` constant in `AuthContext.js`:

```js
const API = 'http://localhost:7070/api'
```

### Build for production

```bash
npm run build
```

---

## Deployment

The frontend is deployed manually to a Digital Ocean droplet and served as static files by Caddy.

```bash
# Build
npm run build

# Deploy
scp -r dist/* jetty@yourjetty:~/deployment/site/folder/dist
```

Caddy config:

```
yourproject.yourURL.dk {
    root * /srv/folder/dist
    file_server
    try_files {path} /index.html
}
```

The `try_files` directive ensures React Router works correctly on page refresh.

---

## Backend

The backend repository is separate — built with Java, Javalin 7, Hibernate ORM and PostgreSQL.

API base URL: `https://yourproject-api.yourURL.dk/api`

---

## Authentication

JWT tokens are created and validated on the backend using `nimbus-jose-jwt`. The frontend stores the token in `localStorage` and sends it as a `Bearer` header on every authenticated request. `jwt-decode` is used only to inspect the token payload — not for verification.

---
