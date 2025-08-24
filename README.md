# ♟️ Chess.com Clone — Real-Time Multiplayer Chess  

## 💡 Overview  

**Chess.com Clone** is a full-stack web application that replicates the **core features of Chess.com**, enabling real-time multiplayer chess matches.  
It combines a **TypeScript-based frontend** with a **Node.js + Socket.IO backend** for smooth, low-latency gameplay.  

The project demonstrates **real-time communication, state management, and responsive design** while maintaining a clean and modern UI using **Tailwind CSS**.  

🔗 **Live Demo:**  https://chess-with-surya-1-frontend.onrender.com/  

---

## 🔐 Real-Time Connection  

- Built with **Socket.IO** for live user connections  
- Real-time game state updates across players  
- Supports joining, leaving, and reconnecting in active games  
- Handles player roles (white/black) automatically  

---

## 🚀 Features  

- ♟️ Create and join live chess games  
- 🎮 Real-time gameplay powered by Socket.IO  
- 🔄 Handles disconnections and reconnections  
- ✅ Chess rules enforced with **Chess.js**  
- 📱 Fully responsive design with Tailwind CSS  
- ⚡ Fast TypeScript frontend for reliable type safety  
- 🗃️ Backend state management for active games  

---

## 🛠 Tech Stack  

### 🧑‍💻 Frontend  
- **TypeScript** (strict typing, maintainable code)  
- **React.js**  
- **Tailwind CSS**  
- React Router  
- Axios  

### 🖥️ Backend  
- **Node.js**  
- **Express.js**  
- **Socket.IO** (real-time communication)  
- **Chess.js** (game rules & validation)  
- **MongoDB + Mongoose** (player & game persistence)  

---

## 📂 Folder Structure  

```plaintext
 backend/
   ├── dist/
   ├── src/
   │   ├── database/
   │   └── index.ts
   ├── .env
   └── package.json (workspace manager)
 fronted/
  ├── pbublic/
  ├── src/
  │   ├── components/
  │   ├── hooks/
  │   ├── screen/
  │   ├── utils/
  │   ├── App.css
  │   ├── App.tsx
  │   ├── index.css
  │   ├── main.tsx
  │   └── vite-env.d.ts
  ├── index.html
  ├── package.json
  └── .env

```
