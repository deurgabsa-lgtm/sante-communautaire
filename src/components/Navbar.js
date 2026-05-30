import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const liens = [
    { path: '/',               label: 'Accueil' },
    { path: '/patients',       label: 'Patients' },
    { path: '/consultation',   label: 'Consultation' },
    { path: '/statistiques',   label: 'Statistiques' },
  ];

  const actif = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>🏥</span>
        <span style={styles.brandText}>Santé Communautaire</span>
      </div>

      <div style={styles.liens}>
        {liens.map(l => (
          <Link
            key={l.path}
            to={l.path}
            style={{
              ...styles.lien,
              ...(actif(l.path) ? styles.lienActif : {}),
            }}
          >
            {l.label}
          </Link>
        ))}

        <Link
          to="/administration"
          style={{
            ...styles.btnAdmin,
            ...(actif('/administration') ? styles.btnAdminActif : {}),
          }}
        >
          Administration
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2c7a7b',
    padding: '0 2rem',
    height: '64px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  brandIcon: { fontSize: '1.6rem' },
  brandText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '1.2rem',
  },
  liens: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  lien: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  lienActif: {
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  btnAdmin: {
    color: '#2c7a7b',
    textDecoration: 'none',
    padding: '0.4rem 1.2rem',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    marginLeft: '0.5rem',
  },
  btnAdminActif: {
    backgroundColor: '#e6f3f3',
  },
};

export default Navbar;
