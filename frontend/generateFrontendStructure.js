// generateFrontendStructure.js

const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "frontend", "src");

const folders = ["components", "pages", "api"];

const files = {
  "App.jsx": `import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Task Manager App</h1>
    </div>
  );
}

export default App;
`,
  "index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  "index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`,
  "api/axios.js": `import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export default instance;
`,
  "pages/LoginPage.jsx": `import React from 'react';

const LoginPage = () => {
  return <div>Login Page</div>;
};

export default LoginPage;
`,
  "pages/RegisterPage.jsx": `import React from 'react';

const RegisterPage = () => {
  return <div>Register Page</div>;
};

export default RegisterPage;
`,
  "pages/Dashboard.jsx": `import React from 'react';

const Dashboard = () => {
  return <div>Dashboard</div>;
};

export default Dashboard;
`,
  "components/Navbar.jsx": `import React from 'react';

const Navbar = () => {
  return <nav className="p-4 bg-blue-600 text-white">Navbar</nav>;
};

export default Navbar;
`,
  "components/TaskCard.jsx": `import React from 'react';

const TaskCard = () => {
  return <div className="p-4 border rounded shadow">Task Card</div>;
};

export default TaskCard;
`,
};

folders.forEach((folder) => {
  const dirPath = path.join(baseDir, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created folder: ${dirPath}`);
  }
});

for (const [relativePath, content] of Object.entries(files)) {
  const filePath = path.join(baseDir, relativePath);
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(filePath, content);
  console.log(`Created file: ${filePath}`);
}

console.log("Frontend structure generated!");
