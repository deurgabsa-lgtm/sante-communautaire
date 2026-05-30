import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import HomePage from "./components/HomePage";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <BrowserRouter>
      <div>
        {user ? (
          <HomePage user={user} onLogout={handleLogout} />
        ) : (
          <AuthPage onLogin={handleLogin} />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;