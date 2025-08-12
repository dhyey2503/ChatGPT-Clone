# ChatGPT Clone

A ChatGPT-like AI-powered chat application with a modern **React** frontend and a **Node.js/Express + Python backend**.  
It supports real-time AI conversation, markdown rendering, and persistent message history for a smooth, user-friendly experience.  
The backend is optimized to deliver **ultra-low-latency responses** using a high-performance AI inference engine for transformer-based models.

## 🚀 Features
- **Interactive Chat UI** – Clean, responsive, and modern interface.
- **Markdown Support** – Rich text formatting with lists, links, and code blocks.
- **Persistent History** – Keeps track of previous chats.
- **Optimized Backend** – Low-latency responses through specialized inference runtime.
- **Customizable** – Swap AI models or tweak UI easily.

## 🛠 Tech Stack
**Frontend:**
- React.js
- React Markdown + Remark GFM
- UUID for message IDs
- TailwindCSS / custom CSS

**Backend:**
- Node.js
- Express.js
- Python (for document storage / AI-related scripts)
- dotenv for environment variables
- **Specialized AI Inference Engine** – Accelerates transformer model execution for near-instant responses.

## 📂 Folder Structure
```
ChatGPT Clone/
├── backend/
│   ├── .env                # Environment variables
│   ├── .env.example        # Example environment file
│   ├── docs_store.py       # Python document storage logic
│   ├── main.py             # Main backend server logic
│   ├── package-lock.json   # Backend dependencies lock
│   ├── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── public/
│   │   ├── index.html      # Main HTML template
│   │   └── favicon.ico     # App icon
│   ├── src/
│   │   ├── App.jsx         # Main chat UI component
│   │   ├── index.js        # App entry point
│   │   ├── components/     # UI components
│   │   └── styles/         # CSS/Tailwind styles
│   ├── package.json        # Frontend dependencies
│   └── package-lock.json   # Frontend dependencies lock
```

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/chatgpt-clone.git
cd chatgpt-clone
```

### 2️⃣ Install dependencies

#### Backend (Node.js + Python)
```bash
cd backend
npm install
pip install -r requirements.txt
```

#### Frontend (React)
```bash
cd ../frontend
npm install
```

### 3️⃣ Set environment variables
Create a `.env` file in the `backend` folder:
```env
PORT=8000
AI_API_KEY=your_api_key_here
```

### 4️⃣ Run the project

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Frontend
```bash
cd ../frontend
npm start
```

Frontend will run at:  
`http://localhost:3000`  

Backend API will run at:  
`http://localhost:8000/api/chat`


