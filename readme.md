# 🌱 BeaconBD – Social Development Platform (Server)

BeaconBD is a community-driven social development platform that connects people through meaningful events and social activities. This repository contains the backend server responsible for event management, database operations, authentication verification, and API services.

🌐 **Live Website:** https://beaconbd.netlify.app

🖥️ **Server API:** https://beaconbd-server.onrender.com

---

## ✨ Key Features

* 📅 **Event Management:** Provides APIs to create, retrieve, update, and delete community events.
* 🔍 **Event Filtering:** Supports retrieving events based on categories and other criteria.
* 🔐 **JWT Authentication:** Verifies authentication tokens to protect private API routes.
* 👤 **User Authorization:** Ensures that only authorized event owners can modify or delete their events.
* 🙋 **Event Participation:** Handles user participation and joining requests for events.
* 🗄️ **MongoDB Integration:** Stores and manages application data using MongoDB.
* 🛡️ **Protected API Routes:** Secures sensitive operations using authentication middleware.
* 🌐 **CORS Configuration:** Allows secure communication between the frontend and backend.
* ⚡ **RESTful API:** Provides structured API endpoints for frontend integration.

---

## 🛠️ Technologies Used

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| Node.js        | JavaScript runtime              |
| Express.js     | Backend framework               |
| TypeScript     | Type safety                     |
| MongoDB        | Database                        |
| MongoDB Driver | Database connectivity           |
| JOSE           | JWT verification                |
| CORS           | Cross-origin resource sharing   |
| dotenv         | Environment variable management |
| Render         | Server deployment               |

---

## 📂 Project Structure

```text
social-development-server/
│
├── src/
│   ├── server.ts
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── ...
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mahadihasanph14-tech/beaconbd-server.git
```

### 2. Navigate to the Project Directory

```bash
cd beaconbd-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
BETTER_AUTH_JWKS_URL=http://localhost:3000/api/auth/jwks
JWT_ISSUER=http://localhost:3000
JWT_AUDIENCE=social-development-api
```

Replace the placeholder values with your actual configuration.

**Important:** Never upload your `.env` file or database credentials to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

The server will run locally at:

```text
http://localhost:5000
```

### 6. Build for Production

```bash
npm run build
```

### 7. Start the Production Server

```bash
npm start
```

---

## 🔗 API Base URL

**Production API:**

https://beaconbd-server.onrender.com/api

### Available API Routes

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/api/events`     | Get all events     |
| GET    | `/api/events/:id` | Get a single event |
| POST   | `/api/events`     | Create a new event |
| PATCH  | `/api/events/:id` | Update an event    |
| DELETE | `/api/events/:id` | Delete an event    |

*Protected endpoints require a valid authentication token. Exact route availability depends on the implemented server routes.*

---

## 🔐 Authentication & Security

The backend integrates with Better Auth through JWT-based authentication.

Security features include:

* JWT token verification.
* JWKS-based public key verification.
* Protected API endpoints.
* User ownership verification.
* Environment-based secret configuration.

---

## 🚀 Deployment

The backend server is deployed on **Render**.

* **Frontend:** https://beaconbd.netlify.app
* **Backend:** https://beaconbd-server.onrender.com

---

## 🎯 Project Goal

BeaconBD aims to make community engagement easier by connecting volunteers with social development opportunities.

The platform encourages people to participate in activities that create positive changes in society.



⭐ Thank you for exploring BeaconBD!
