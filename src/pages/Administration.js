import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

// Mot de passe simple pour protéger l'admin (en prod, utiliser JWT)
const MOT_DE_PASSE = 'admin123';

function Administration() {
  const [connecte, setConnecte]     = useState(false);
  const [mdp, setMdp]               = useState('');
  const [erreurMdp, setErreurMdp]   = useState('');
  const [onglet, setOnglet]         = useState('consultations');
  const [consultations, setConsultations] = useState([]);
  const [patients, setPatients]     = useState([]);
  const [chargement, setChargement] = useState(false);

  const handleConnexion = (e) => {
    e.preventDefault();
    if (mdp === MOT_DE_PASSE) {
      setConnecte(true);
      setErreurMdp('');
      chargerDonnees();
    } else {
      setErreurMdp('Mot de passe incorrect.');
    }
  };

  const chargerDonnees = () => {
    setChargement(true);
    Promise.allSettled([
      axios.get(`${API}/consultations/`),
      axios.get(`${API}/patients/`),
    ]).then(([c, p]) => {
      if (c.status === 'fulfilled') setConsultations(c.value.data);
      if (p.status === 'fulfilled') setPatients(p.value.data);
      setChargement(false);
    });
  };

  const supprimerConsultation = (id) => {
    if (!window.confirm('Supprimer cette consultation ?')) return;
    axios.delete(`${API}/consultations/${id}/`)
      .then(() => setConsultations(consultations.filter(c => c.id !== id)))
      .catch(() => alert('Erreur lors de la suppression.'));
  };

  const supprimerPatient = (id) => {
    if (!window.confirm('Supprimer ce patient et toutes ses consultations ?')) return;
    axios.delete(`${API}/patients/${id}/`)
      .then(() => setPatients(patients.filter(p => p.id !== id)))
      .catch(() => alert('Erreur lors de la suppression.'));
  };

  // Page de connexion
  if (!connecte) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginCard}>
          <div style={styles.loginIcon}>🔐</div>
          <h2 style={styles.loginTitre}>Administration</h2>
          <p style={styles.loginSous}>Accès réservé aux administrateurs</p>

          <form onSubmit={handleConnexion} style={styles.loginForm}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={mdp}
              onChange={e => setMdp(e.target.value)}
              style={styles.loginInput}
              required
            />
            {erreurMdp && <p style={styles.loginErreur}>{erreurMdp}</p>}
            <button type="submit" style={styles.loginBtn}>
              🔓 Se connecter
            </button>
          </form>

          <p style={styles.loginHint}>Mot de passe par défaut : <code>admin123</code></p>
        </div>
      </div>
    );
  }

  // Dashboard admin
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.titre}> Administration</h2>
        <button onClick={() => setConnecte(false)} style={styles.btnDeconnexion}>
          🚪 Déconnexion
        </button>
      </div>

      {/* Onglets */}
      <div style={styles.onglets}>
        {[
          { id: 'consultations', label: ` Consultations (${consultations.length})` },
          { id: 'patients',      label: ` Patients (${patients.length})` },
          { id: 'systeme',       label: ' Système' },
        ].map(o => (
          <button
            key={o.id}
            onClick={() => setOnglet(o.id)}
            style={{ ...styles.onglet, ...(onglet === o.id ? styles.ongletActif : {}) }}
          >
            {o.label}
          </button>
        ))}
      </div>

      {chargement && <div style={styles.chargement}> Chargement...</div>}

      {/* Consultations */}
      {onglet === 'consultations' && !chargement && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitre}>Toutes les consultations</h3>
          {consultations.length === 0 ? (
            <div style={styles.vide}>Aucune consultation enregistrée</div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Diagnostic</th>
                    <th style={styles.th}>Notes</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((c, i) => (
                    <tr key={c.id} style={i % 2 === 0 ? styles.trPair : styles.trImpair}>
                      <td style={styles.td}>#{c.id}</td>
                      <td style={styles.td}>{c.patient_nom || `Patient #${c.patient}`}</td>
                      <td style={styles.td}>{c.date_fmt || c.date?.slice(0, 16).replace('T', ' ')}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>{c.diagnostic || '—'}</span>
                      </td>
                      <td style={styles.td}>{c.notes || '—'}</td>
                      <td style={styles.td}>
                        <button onClick={() => supprimerConsultation(c.id)} style={styles.btnDel}>
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Patients */}
      {onglet === 'patients' && !chargement && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitre}>Tous les patients</h3>
          {patients.length === 0 ? (
            <div style={styles.vide}>Aucun patient enregistré</div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Nom</th>
                    <th style={styles.th}>Prénom</th>
                    <th style={styles.th}>Âge</th>
                    <th style={styles.th}>Village</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, i) => (
                    <tr key={p.id} style={i % 2 === 0 ? styles.trPair : styles.trImpair}>
                      <td style={styles.td}>#{p.id}</td>
                      <td style={styles.td}><strong>{p.nom}</strong></td>
                      <td style={styles.td}>{p.prenom}</td>
                      <td style={styles.td}>{p.age} ans</td>
                      <td style={styles.td}>{p.village || '—'}</td>
                      <td style={styles.td}>
                        <button onClick={() => supprimerPatient(p.id)} style={styles.btnDel}>
                          🗑️ Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Système */}
      {onglet === 'systeme' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitre}>Informations système</h3>
          <div style={styles.sysGrid}>
            {[
              { label: 'Backend',        valeur: 'Django REST Framework' },
              { label: 'Frontend',       valeur: 'React.js' },
              { label: 'Base de données', valeur: 'SQLite3' },
              { label: 'Fuseau horaire', valeur: 'Africa/Ndjamena' },
              { label: 'API URL',        valeur: 'http://127.0.0.1:8000/api/' },
              { label: 'Admin Django',   valeur: 'http://127.0.0.1:8000/admin/' },
            ].map((item, i) => (
              <div key={i} style={styles.sysCard}>
                <div style={styles.sysLabel}>{item.label}</div>
                <div style={styles.sysValeur}>{item.valeur}</div>
              </div>
            ))}
          </div>

          <div style={styles.alerteInfo}>
            <strong> Conseil :</strong> Pour accéder à l'admin Django complet, allez sur{' '}
            <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" style={{ color: '#2c7a7b' }}>
              http://127.0.0.1:8000/admin/
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container:       { padding: '2rem 0' },
  header:          { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  titre:           { color: '#2c7a7b', fontSize: '1.6rem' },
  btnDeconnexion:  { padding: '0.5rem 1rem', backgroundColor: '#fed7d7', color: '#c53030', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  onglets:         { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  onglet:          { padding: '0.6rem 1.2rem', backgroundColor: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' },
  ongletActif:     { backgroundColor: '#2c7a7b', color: '#fff' },
  chargement:      { textAlign: 'center', padding: '2rem', color: '#718096' },
  section:         { backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  sectionTitre:    { color: '#2c7a7b', marginBottom: '1rem', fontSize: '1.1rem' },
  vide:            { color: '#718096', textAlign: 'center', padding: '2rem' },
  tableWrap:       { overflowX: 'auto' },
  table:           { width: '100%', borderCollapse: 'collapse' },
  thead:           { backgroundColor: '#2c7a7b' },
  th:              { color: '#fff', padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.85rem' },
  td:              { padding: '0.7rem 1rem', fontSize: '0.9rem' },
  trPair:          { borderBottom: '1px solid #edf2f7', backgroundColor: '#fff' },
  trImpair:        { borderBottom: '1px solid #edf2f7', backgroundColor: '#f7fafc' },
  badge:           { backgroundColor: '#e6f3f3', color: '#2c7a7b', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '500' },
  btnDel:          { padding: '0.3rem 0.8rem', backgroundColor: '#fed7d7', color: '#c53030', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500' },
  sysGrid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  sysCard:         { backgroundColor: '#f7fafc', borderRadius: '8px', padding: '1rem' },
  sysLabel:        { color: '#718096', fontSize: '0.82rem', marginBottom: '0.3rem', fontWeight: '600', textTransform: 'uppercase' },
  sysValeur:       { color: '#2d3748', fontWeight: '500', fontSize: '0.95rem' },
  alerteInfo:      { backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' },
  loginWrap:       { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' },
  loginCard:       { backgroundColor: '#fff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', width: '100%', maxWidth: '380px', textAlign: 'center' },
  loginIcon:       { fontSize: '3rem', marginBottom: '1rem' },
  loginTitre:      { color: '#2c7a7b', fontSize: '1.5rem', marginBottom: '0.3rem' },
  loginSous:       { color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem' },
  loginForm:       { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  loginInput:      { padding: '0.8rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none', textAlign: 'center' },
  loginErreur:     { color: '#c53030', fontSize: '0.85rem' },
  loginBtn:        { padding: '0.8rem', backgroundColor: '#2c7a7b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' },
  loginHint:       { color: '#a0aec0', fontSize: '0.8rem', marginTop: '1rem' },
};

export default Administration;
