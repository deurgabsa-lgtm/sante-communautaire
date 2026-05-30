import { useState } from "react";
import "./AuthPage.css";

export default function AuthPage({ onLogin }) {
  const [tab,        setTab]        = useState("login");
  const [role,       setRole]       = useState("agent");
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass,  setLoginPass]  = useState("");
  const [regNom,     setRegNom]     = useState("");
  const [regEmail,   setRegEmail]   = useState("");
  const [regPass,    setRegPass]    = useState("");

  const getUsers = () => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [
      { id: 1, nom: "Deurgabsa", email: "admin@sante.td", password: "admin123", role: "admin" },
      { id: 2, nom: "Agent Mahamat", email: "agent@sante.td", password: "agent123", role: "agent" },
    ];
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!loginEmail || !loginPass) { setError("Remplir tous les champs."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = getUsers().find(u => u.email === loginEmail && u.password === loginPass);
      if (user) {
        localStorage.setItem("token", btoa(user.email));
        localStorage.setItem("user", JSON.stringify(user));
        setSuccess("Connexion réussie !");
        setTimeout(() => onLogin(user), 600);
      } else {
        setError("Email ou mot de passe incorrect.");
      }
      setLoading(false);
    }, 800);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!regNom || !regEmail || !regPass) { setError("Remplir tous les champs."); return; }
    if (regPass.length < 6) { setError("Mot de passe min 6 caractères."); return; }
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      if (users.find(u => u.email === regEmail)) {
        setError("Email déjà utilisé."); setLoading(false); return;
      }
      users.push({ id: users.length + 1, nom: regNom, email: regEmail, password: regPass, role });
      localStorage.setItem("users", JSON.stringify(users));
      setSuccess("Compte créé ! Connectez-vous.");
      setRegNom(""); setRegEmail(""); setRegPass(""); setRole("agent");
      setLoading(false);
      setTimeout(() => { setTab("login"); setSuccess(""); }, 2000);
    }, 800);
  };

  return (
    <div className="auth-page">

      {/* ── Logo haut gauche ── */}
      <div className="auth-logo">
         Santé Communautaire
      </div>

      {/* ── Carte centrale ── */}
      <div className="auth-card">

        {/* Avatar + Nom Deurgabsa */}
        <div className="auth-avatar">
          <div className="avatar-circle">🧑‍⚕️</div>
          <p className="avatar-name">Deurgabsa</p>
          <p className="avatar-role">Administrateur</p>
        </div>

        {/* Onglets */}
        <div className="auth-tabs">
          <button className={"auth-tab " + (tab === "login" ? "active" : "")}
            onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>
            🔑 Connexion
          </button>
          <button className={"auth-tab " + (tab === "register" ? "active" : "")}
            onClick={() => { setTab("register"); setError(""); setSuccess(""); }}>
            ➕ Inscription
          </button>
        </div>

        {error   && <div className="auth-alert error"> {error}</div>}
        {success && <div className="auth-alert success">✅ {success}</div>}

        {/* ── CONNEXION ── */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="auth-form">
            <h3 className="form-title">Connexion</h3>
            <p className="form-sub">Entrez vos identifiants</p>

            <div className="form-group">
              <label> Email</label>
              <input type="email" placeholder="agent@sante.td"
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label>🔒 Mot de passe</label>
              <div className="input-wrap">
                <input type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={loginPass} onChange={e => setLoginPass(e.target.value)} />
                <button type="button" className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}>
                  {showPass ? "" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Connexion..." : "🔑 Se connecter"}
            </button>

            <p className="security-note">🔐 Connexion sécurisée</p>
          </form>
        )}

        {/* ── INSCRIPTION ── */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="auth-form">
            <h3 className="form-title">Créer un compte</h3>
            <p className="form-sub">Choisissez votre rôle</p>

            <div className="role-grid">
              <div className={"role-card " + (role === "agent" ? "selected" : "")}
                onClick={() => setRole("agent")}>
                🩺 Agent
              </div>
              <div className={"role-card " + (role === "admin" ? "selected" : "")}
                onClick={() => setRole("admin")}>
                Admin
              </div>
            </div>

            <div className="form-group">
              <label>👤 Nom complet</label>
              <input type="text" placeholder="Dr. Mahamat Ali"
                value={regNom} onChange={e => setRegNom(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="agent@sante.td"
                value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label>🔒 Mot de passe</label>
              <input type="password" placeholder="Min 6 caractères"
                value={regPass} onChange={e => setRegPass(e.target.value)} />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Création..." : "✅ Créer mon compte"}
            </button>

            <p className="security-note">🔐 Connexion sécurisée</p>
          </form>
        )}

      </div>
    </div>
  );
}