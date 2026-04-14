# Chanderi Eco Retreat - Reservation System

The Chanderi Eco Retreat platform is a responsive, fast-loading, database-driven application optimized for the modern web space. It leverages a tightly integrated Mongoose/Express backend working securely alongside a rich, Vite-powered React UI frontend logic. 

## Technical Fundamentals

### 1. Technology Choices
- **React 18 + Vite**: Empowers lightning fast component rendering alongside near-instant hot module replacement mapping.
- **Tailwind CSS**: A dynamic, highly responsive styling library producing sleek glassmorphism and modern gradient boundaries rapidly.
- **Express.JS**: A rigid, robust unopinionated node routing hierarchy to safely handle scaling requests.
- **MongoDB**: Used seamlessly alongside the powerful native `mongoose` schemas allowing advanced features natively (Like automatic math calculation hooks resolving Total Check Out constraints securely behind validations).
- **JsonWebTokens (`JWT`)**: Handles role-based identity checks safely. `admin` capabilities unlock private data while default `users` bypass to native portals seamlessly natively in cache.

### 2. File Topology
```
chanderi-eco-retreat/
├── backend/                  # Server Node.js Application
│   ├── /controllers          # Express Request/Response bindings
│   ├── /models               # Mongoose Object Relational Mappings
│   ├── /routes               # Endpoint network pathways mapped securely
│   └── server.js             # Execution hook and Cors binding
└── frontend/                 # Client Javascript Browser application
    ├── /src
    │   ├── /components       # Reusable chunks (Navbar, ContactForm)
    │   ├── /pages            # Route entry screens (AdminPage, GalleryPage)
    │   └── /services         # Axios API HTTP handler endpoints mapping dynamically over network
    ├── index.css             # Tailwind imports
    └── vite.config.js        # Packaging directives targeting /api proxies port bindings mappings
```

## Running the Architecture

To spin up this platform, invoke your node commands parallel inside both execution limits natively.

1. Locate into the `backend/` directory boundary.
   - Inject necessary properties inside your environment mapping (For ex: MongoDB URL, Secrets).
   - Execute: `npm run dev` (Connects the native Express pipeline over port 5000).
   
2. Move over into the `frontend/` directory boundary.
   - Execute: `npm run dev` (Bundles and maps your React application interfaces typically rendering locally at standard port 3000 mapping). 

## Primary Features 
* **User vs Admin Dual Authentication**: Log in as a User safely to checkout on cart. Log in as an Admin separately to intercept analytics and queries locally.
* **Cart Calculations**: Dynamic checkout math. Add "Jungle Safaris" directly and the application syncs perfectly into backend schemas natively.
* **Real-time Alerting**: Implements `react-hot-toast` rendering dynamic native OS-style pushes explicitly guiding interfaces visually safely!
