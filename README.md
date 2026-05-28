# Trip planner API

A REST API for an AI-powered trip planner application where users can generate, save, update, and manage travel plans. Built using Express.js, Node.js, MongoDB, JWT authentication, and Google OAuth 2.0.

---

## Demo Link

[Live API](https://trip-planner-backend-five.vercel.app)

---


## Quick Start

```
git clone https://github.com/rahulCode1/Travel_AI_Backend.git
cd backend
npm i
npm run dev # or `npm start`

```

---

# Techonologies

Node.js

- Express.js
- MongoDB
- JWT Authentication
- Google OAuth 2.0

---

## Features

**Home**

- Plan trips by entering destination, budget, and trip duration.

**My Trips**

- All saved trips

**Trip Details**

- View full trip details (Trip destination & more.)
- Update trip plans
- Compare original & updated trip
- Save updated trip
- Delete trip
- Mark trips as completed

**Authentication**

- User sign in with google
- Protected routes for save trip, view saved trips, view trip details, update & delete trip

---

## Environment Variables

```
OPENROUTER_API_KEY=XXXXXXXXXXX
PORT=80
MONGODB=XXXXXXXXXXXXXXXXXX
GOOGLE_CLIENT_ID=XXXXXXXXXXXXXXX
GOOGLE_CLIENT_SECRET=GOXXXXXXXXXXX
FRONTEND_URL=http://localhost:3000
SECRET_KEY=XXXXXXX
BACKEND_URI=http://localhost:80
```

---

## API Reference

### **POST /api/travel-planner**<br>

Generate trip <br>
Sample Response: <br>

```
{ destination, duration, budget }
```

### **POST /api/save-trip**<br>

Save trip <br>
Sample Response: <br>

```
{_id, destination, best_time, top_attractions...}
```

### **GET /api/saved-trip** <br>

Get all saved trips <br>
Sample Response:<br>

```
[{_id, destination, best_time, top_attractions...}, ...]
```

### **GET /api/:tripId/trip-details**<br>

Trip details <br>
Sample Response<br>

```
{_id, destination, best_time, top_attractions...}
```

### **POST /api/update-trip/:tripId**<br>

Generate new trip based on changes<br>
Sample Response: <br>

```
{ destination, duration, budget }
```

### **PATCH /api/save-updated-trip/:tripId**<br>

Save updated trip<br>
Sample Response<br>

```
{_id, destination, best_time, top_attractions...}
```

### **DELETE /api/:tripId** <br>

Delete trip<br>

### **PATCH /api/:tripId/mark-complete** <br>

Mark trip as complete<br>

### **GET /auth/google**<br>

Call google OAuth2.0 <br>

### **GET /auth/google/callback**<br>

Save user <br>
Generate JWT token<br>

### **GET /user/me** <br>

Verify JWT token

---

## Contact

For bugs or feature requests, please reach out to rahul7497678@gmail.com
