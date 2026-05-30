import React, { useState } from "react";
import Accueil from "../pages/Accueil";
import Patients from "../pages/Patients";
import Consultation from "../pages/Consultation";
import Statistiques from "../pages/Statistiques";
import Administration from "../pages/Administration";

function HomePage({ user, onLogout }) {
  const [page, setPage] = useState("accueil");

  const nav = [
    { id: "accueil",         label: " Accueil"        },
    { id: "patients",        label: "👥 Patients"       },
    { id: "consultation",    label: "🩺 Consultation"   },
    { id: "statistiques",    label: " Statistiques"   },
    { id: "administration",  label: " Administration" },
  ];

  const renderPage = () => {
    switch (page) {
      case "accueil":        return <Accueil />;
      case "patients":       return <Patients />;
      case "consultation":   return <Consultation />;
      case "statistiques":   return <Statistiques />;
      case "administration": return <Administration />;
      default:               return <Accueil />;
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f5f6f8", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem", height: "54px", background: "#fff",
        borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "15px", color: "#0f7c5a" }}>
          🏥 Santé Communautaire
        </div>

        {/* Liens */}
        <div style={{ display: "flex", gap: "2px" }}>
          {nav.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              padding: "6px 12px", border: "none", borderRadius: "7px",
              fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
              background: page === item.id ? "#0f7c5a" : "transparent",
              color: page === item.id ? "#fff" : "#555",
              fontWeight: page === item.id ? 700 : 400,
              transition: "all 0.15s"
            }}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Utilisateur + Déconnexion */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
            background: user?.role === "admin" ? "#eeedfe" : "#e1f5ee",
            color: user?.role === "admin" ? "#534ab7" : "#0f6e56"
          }}>
            {user?.role === "admin" ? " Admin" : "🩺 Agent"}
          </span>
          <span style={{ fontSize: "13px", color: "#555" }}>👤 {user?.nom}</span>
          <button onClick={onLogout} style={{
            padding: "6px 14px", background: "#0f7c5a", color: "#fff",
            border: "none", borderRadius: "7px", cursor: "pointer",
            fontSize: "13px", fontWeight: 600, fontFamily: "inherit"
          }}>
            🚪 Déconnexion
          </button>
        </div>
      </nav>

      {/* ── Contenu ── */}
      <div style={{ padding: "1.5rem" }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default HomePage;