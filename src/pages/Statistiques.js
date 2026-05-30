import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

function Statistiques() {
  const [stats, setStats] = useState({ patients: 0, consultations: 0, maladies: 0, symptomes: 0 });
  const [consultations, setConsultations] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const reqs = [
      axios.get(`${API}/patients/`),
      axios.get(`${API}/consultations/`),
      axios.get(`${API}/maladies/`),
      axios.get(`${API}/symptomes/`),
    ];

    Promise.allSettled(reqs).then(([p, c, m, s]) => {
      setStats({
        patients:      p.status === 'fulfilled' ? p.value.data.length : 0,
        consultations: c.status === 'fulfilled' ? c.value.data.length : 0,
        maladies:      m.status === 'fulfilled' ? m.value.data.length : 0,
        symptomes:     s.status === 'fulfilled' ? s.value.data.length : 0,
      });
      if (c.status === 'fulfilled') setConsultations(c.value.data.slice(0, 8));
      setChargement(false);
    });
  }, []);

  const cartes = [
    { label: 'Patients enregistrés', valeur: stats.patients,      icon: '👥', couleur: '#2c7a7b' },
    { label: 'Consultations',        valeur: stats.consultations,  icon: '🩺', couleur: '#3182ce' },
    { label: 'Maladies référencées', valeur: stats.maladies,       icon: '', couleur: '#e53e3e' },
    { label: 'Symptômes référencés', valeur: stats.symptomes,      icon: '', couleur: '#d69e2e' },
  ];

  if (chargement) {
    return (
      <div style={styles.loading}>
        <div style={{ fontSize: '2.5rem' }}></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.titre}> Statistiques</h2>

      {/* Cartes */}
      <div style={styles.grid}>
        {cartes.map((c, i) => (
          <div key={i} style={{ ...styles.card, borderTop: `4px solid ${c.couleur}` }}>
            <div style={styles.cardIcon}>{c.icon}</div>
            <div style={{ ...styles.valeur, color: c.couleur }}>{c.valeur}</div>
            <div style={styles.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Dernières consultations */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitre}> Dernières consultations</h3>
        {consultations.length === 0 ? (
          <div style={styles.vide}>Aucune consultation enregistrée</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Diagnostic</th>
                  <th style={styles.th}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c, i) => (
                  <tr key={c.id} style={i % 2 === 0 ? styles.trPair : styles.trImpair}>
                    <td style={styles.td}>{c.patient_nom || `Patient #${c.patient}`}</td>
                    <td style={styles.td}>{c.date_fmt || c.date?.slice(0, 10)}</td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{c.diagnostic || '—'}</span>
                    </td>
                    <td style={styles.td}>{c.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Infos système */}
      <div style={styles.infoSection}>
        <h3 style={styles.sectionTitre}> Informations système</h3>
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <strong>Base médicale</strong>
            <p>10 maladies référencées</p>
          </div>
          <div style={styles.infoCard}>
            <strong>Serveur</strong>
            <p>Django REST Framework</p>
          </div>
          <div style={styles.infoCard}>
            <strong>Fuseau horaire</strong>
            <p>Africa/Ndjamena</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container:    { padding: '2rem 0' },
  titre:        { color: '#2c7a7b', marginBottom: '1.5rem', fontSize: '1.6rem' },
  loading:      { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '1rem', color: '#718096' },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card:         { backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardIcon:     { fontSize: '2.2rem', marginBottom: '0.5rem' },
  valeur:       { fontSize: '2.8rem', fontWeight: '800', lineHeight: 1 },
  cardLabel:    { color: '#718096', marginTop: '0.5rem', fontSize: '0.9rem' },
  section:      { backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  sectionTitre: { color: '#2c7a7b', marginBottom: '1rem', fontSize: '1.1rem' },
  vide:         { color: '#718096', textAlign: 'center', padding: '2rem' },
  tableWrap:    { overflowX: 'auto' },
  table:        { width: '100%', borderCollapse: 'collapse' },
  thead:        { backgroundColor: '#2c7a7b' },
  th:           { color: '#fff', padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.9rem' },
  td:           { padding: '0.75rem 1rem', fontSize: '0.9rem' },
  trPair:       { borderBottom: '1px solid #edf2f7', backgroundColor: '#fff' },
  trImpair:     { borderBottom: '1px solid #edf2f7', backgroundColor: '#f7fafc' },
  badge:        { backgroundColor: '#e6f3f3', color: '#2c7a7b', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500' },
  infoSection:  { backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  infoGrid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' },
  infoCard:     { backgroundColor: '#f7fafc', borderRadius: '8px', padding: '1rem', fontSize: '0.9rem', color: '#4a5568' },
};

export default Statistiques;
