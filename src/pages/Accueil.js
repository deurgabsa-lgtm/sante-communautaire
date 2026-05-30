import React from 'react';
import { Link } from 'react-router-dom';

function Accueil() {
  const cards = [
    { path: '/patients',     icon: '', titre: 'Patients',     desc: 'Gérer les dossiers patients' },
    { path: '/consultation', icon: '', titre: 'Consultation', desc: 'Saisir les symptômes et obtenir un diagnostic' },
    { path: '/statistiques', icon: '', titre: 'Statistiques', desc: 'Voir les données et indicateurs' },
    { path: '/administration', icon: '', titre: 'Administration', desc: 'Gérer les comptes et paramètres' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroIcon}></div>
        <h1 style={styles.titre}>Assistant IA pour Agents de Santé</h1>
        <p style={styles.sous}>Obtenez des recommandations médicales basées sur les symptômes observés</p>
      </div>

      <div style={styles.grid}>
        {cards.map((c, i) => (
          <Link key={i} to={c.path} style={styles.card}>
            <div style={styles.cardIcon}>{c.icon}</div>
            <h3 style={styles.cardTitre}>{c.titre}</h3>
            <p style={styles.cardDesc}>{c.desc}</p>
            <div style={styles.cardArrow}>→</div>
          </Link>
        ))}
      </div>

      <div style={styles.info}>
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}></span>
          <span>Diagnostic rapide basé sur les symptômes</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}></span>
          <span>Suivi complet des dossiers patients</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}></span>
          <span>Recommandations adaptées au terrain</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem 0' },
  hero: {
    textAlign: 'center',
    padding: '3rem 1rem 2rem',
    background: 'linear-gradient(135deg, #2c7a7b 0%, #1a5c5d 100%)',
    borderRadius: '16px',
    color: '#fff',
    marginBottom: '2rem',
  },
  heroIcon: { fontSize: '3.5rem', marginBottom: '1rem' },
  titre: { fontSize: '2rem', fontWeight: '700', marginBottom: '0.75rem' },
  sous: { fontSize: '1.05rem', opacity: 0.85, maxWidth: '500px', margin: '0 auto' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem 1.5rem',
    textDecoration: 'none',
    color: '#333',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '2px solid transparent',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
  },
  cardIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  cardTitre: { color: '#2c7a7b', fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' },
  cardDesc: { color: '#718096', fontSize: '0.9rem', lineHeight: 1.5, flex: 1 },
  cardArrow: { marginTop: '1rem', color: '#2c7a7b', fontSize: '1.3rem', fontWeight: 'bold' },
  info: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '1.5rem',
    backgroundColor: '#e6f3f3',
    borderRadius: '12px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#2c7a7b',
    fontWeight: '500',
  },
  infoIcon: { fontSize: '1.2rem' },
};

export default Accueil;
