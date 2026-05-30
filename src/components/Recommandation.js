import React from 'react';

// Composant réutilisable pour afficher une recommandation
function Recommandation({ recommandation, index }) {
  const { maladie, action, urgence, score, matches } = recommandation;

  const couleur = () => {
    if (urgence === 'Urgence') return '#e53e3e';
    if (urgence === 'Haute')   return '#dd6b20';
    if (urgence === 'Moyenne') return '#d69e2e';
    return '#38a169';
  };

  return (
    <div style={{ ...styles.card, borderLeft: `5px solid ${couleur()}` }}>
      <div style={styles.header}>
        <h4 style={{ ...styles.titre, color: couleur() }}>
          {index + 1}. {maladie}
        </h4>
        <span style={{ ...styles.badge, backgroundColor: couleur() }}>
          {urgence}
        </span>
      </div>

      <div style={styles.body}>
        <p><strong>Score :</strong> {score} symptôme(s) correspondant(s)</p>
        <p style={styles.action}><strong>Action :</strong> {action}</p>
        {matches && matches.length > 0 && (
          <p style={styles.matches}>
            <strong>Reconnus :</strong> {matches.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  card:    { backgroundColor: '#fff', borderRadius: '10px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  header:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' },
  titre:   { margin: 0, fontSize: '1rem', fontWeight: '700' },
  badge:   { color: '#fff', padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' },
  body:    { display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: '#4a5568' },
  action:  { lineHeight: 1.5 },
  matches: { color: '#718096', fontSize: '0.85rem' },
};

export default Recommandation;
