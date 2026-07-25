# Klyro Server

A scalable backend for **Klyro**, a Discord-inspired real-time chat application. It powers servers, channels, messaging, authentication, and live communication using WebSockets.

> Built with a backend-first approach focusing on scalability, performance, and clean architecture.

## ✨ Features

### Authentication
- JWT Authentication (Access + Refresh Tokens)
- HttpOnly Cookie based authentication
- Secure password hashing with bcrypt
- Token rotation
- Logout from all devices

### Servers
- Create, update and delete servers
- Join servers using invite codes
- Leave servers
- Server ownership validation
- Member management

### Channels
- Create Text & Voice channels
- Update/Delete channels
- Prevent duplicate channel names
- Channel ordering & positioning

### Messaging
- Real-time messaging using Socket.IO
- Edit & delete messages
- Message history
- File attachment support
- Pagination support

### Real-time
- WebSocket based communication
- Live message delivery
- User connection/disconnection events

### Performance
- Redis caching
- Efficient PostgreSQL queries
- Optimized Prisma relations

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache | Redis |
| Authentication | JWT + HttpOnly Cookies |
| Real-time | Socket.IO |
| Validation | Zod |
| Password Hashing | bcrypt |
| File Uploads | Multer |
| Package Manager | npm |

---

# Project Structure

```
src/
│
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── socket/
├── prisma/
├── utils/
├── validators/
└── index.ts
```

---

# API Modules

- Authentication
- Users
- Servers
- Members
- Channels
- Messages
- Attachments

---

# Authentication Flow

```
Login
   │
   ▼
Generate Access Token
Generate Refresh Token
   │
   ▼
Store Refresh Token
(HttpOnly Cookie)
   │
   ▼
Authenticated Requests
   │
   ▼
Refresh Access Token
when expired
```

---

# Database

Main entities include

- User
- RefreshToken
- Server
- ServerMember
- Channel
- Message
- Attachment

---

# WebSocket Events

### Client → Server

- connect
- disconnect
- send-message

### Server → Client

- receive-message
- user-connected
- user-disconnected

---

# Performance Optimizations

- Redis caching
- Indexed PostgreSQL queries
- Efficient Prisma relations
- Cookie-based authentication
- Modular architecture
- Centralized error handling

---

# Future Improvements

- Voice channels
- Video calls (WebRTC)
- Direct Messages
- Threaded conversations
- Reactions
- Role & Permission System
- Presence (Online/Offline)
- Typing Indicators
- Message Search
- Notifications
- Rate Limiting
- Docker Deployment
- CI/CD Pipeline

---

# Frontend Repository

The frontend is available in a separate repository.

```
klyro-client
```

---

# License

MIT License

---

## Author

**Abhishek Sharma**

Backend Developer

If you found this project useful, consider giving it a ⭐ on GitHub.