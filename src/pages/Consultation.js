import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

function Consultation() {
  const [patients, setPatients]           = useState([]);
  const [patientId, setPatientId]         = useState('');
  const [symptomes, setSymptomes]         = useState('');
  const [notes, setNotes]                 = useState('');
  const [recommandations, setRecommandations] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [erreur, setErreur]               = useState('');
  const [sauvegarde, setSauvegarde]       = useState('');

  useEffect(() => {
    axios.get(`${API}/patients/`)
      .then(res => setPatients(res.data))
      .catch(() => setErreur('Impossible de charger les patients.'));
  }, []);

  const couleurUrgence = (urgence) => {
    if (urgence === 'Urgence') return '#e53e3e';
    if (urgence === 'Haute')   return '#dd6b20';
    if (urgence === 'Moyenne') return '#d69e2e';
    return '#38a169';
  };

  const badgeUrgence = (urgence) => ({
    display: 'inline-block',
    backgroundColor: couleurUrgence(urgence),
    color: '#fff',
    padding: '0.2rem 0.7rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginLeft: '0.5rem',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');
    setRecommandations([]);
    setSauvegarde('');

    const liste = symptomes.split(',').map(s => s.trim()).filter(s => s);

    if (liste.length === 0) {
      setErreur('Veuillez saisir au moins un symptôme.');
      setLoading(false);
      return;
    }

    axios.post(`${API}/recommandation/`, {
      symptomes:  liste,
      patient_id: patientId || null,
      notes:      notes,
    })
      .then(res => {
        setRecommandations(res.data.recommandations);
        if (patientId) setSauvegarde('Consultation sauvegardée avec succès !');
        if (res.data.recommandations.length === 0) {
          setErreur('Aucune maladie correspondante trouvée pour ces symptômes.');
        }
      })
      .catch(() => setErreur('Erreur de connexion. Vérifiez que Django est démarré.'))
      .finally(() => setLoading(false));
  };

  const handleReset = () => {
    setSymptomes('');
    setNotes('');
    setPatientId('');
    setRecommandations([]);
    setErreur('');
    setSauvegarde('');
  };

  const symptomesRapides = ['fièvre', 'toux', 'fatigue', 'diarrhée', 'vomissements', 'maux de tête', 'frissons', 'nuque'];

  const ajouterSymptome = (s) => {
    const actuel = symptomes.split(',').map(x => x.trim()).filter(x => x);
    if (!actuel.includes(s)) {
      setSymptomes([...actuel, s].join(', '));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titre}>🩺 Nouvelle Consultation</h2>

      <div style={styles.grid}>
        {/* Formulaire */}
        <div style={styles.card}>
          <h3 style={styles.cardTitre}>Informations de la consultation</h3>

          <form onSubmit={handleSubmit}>
            {/* Patient */}
            <div style={styles.champ}>
              <label style={styles.label}>Patient</label>
              <select
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                style={styles.select}
              >
                <option value="">— Sélectionner un patient (optionnel) —</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.age} ans)</option>
                ))}
              </select>
            </div>

            {/* Symptômes rapides */}
            <div style={styles.champ}>
              <label style={styles.label}>Symptômes fréquents (clic pour ajouter)</label>
              <div style={styles.tags}>
                {symptomesRapides.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ajouterSymptome(s)}
                    style={styles.tag}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Saisie symptômes */}
            <div style={styles.champ}>
              <label style={styles.label}>Symptômes observés * <span style={styles.hint}>(séparés par des virgules)</span></label>
              <input
                placeholder="ex: fièvre, toux, fatigue"
                value={symptomes}
                onChange={e => setSymptomes(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            {/* Notes */}
            <div style={styles.champ}>
              <label style={styles.label}>Notes supplémentaires</label>
              <textarea
                placeholder="Observations complémentaires..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={styles.textarea}
              />
            </div>

            <div style={styles.btnGroup}>
              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? ' Analyse en cours...' : ' Obtenir Recommandations'}
              </button>
              <button type="button" onClick={handleReset} style={styles.btnReset}>
                🔄 Réinitialiser
              </button>
            </div>
          </form>

          {erreur    && <div style={styles.erreurBox}>❌ {erreur}</div>}
          {sauvegarde && <div style={styles.successBox}>✅ {sauvegarde}</div>}
        </div>

        {/* Résultats */}
        <div>
          {loading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}></div>
              <p>Analyse des symptômes en cours...</p>
            </div>
          )}

          {recommandations.length > 0 && (
            <div>
              <h3 style={styles.resultTitre}>
                 {recommandations.length} recommandation(s) trouvée(s)
              </h3>
              {recommandations.map((r, i) => (
                <div key={i} style={{ ...styles.recCard, borderLeft: `5px solid ${couleurUrgence(r.urgence)}` }}>
                  <div style={styles.recHeader}>
                    <h4 style={{ color: couleurUrgence(r.urgence), margin: 0 }}>
                      {i + 1}. {r.maladie}
                    </h4>
                    <span style={badgeUrgence(r.urgence)}>{r.urgence}</span>
                  </div>
                  <div style={styles.recBody}>
                    <p><strong>🔬 Score :</strong> {r.score} symptôme(s) correspondant(s)</p>
                    <p style={styles.recAction}><strong> Action :</strong> {r.action}</p>
                    {r.matches && (
                      <p style={styles.recMatches}>
                        <strong>Symptômes reconnus :</strong> {r.matches.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && recommandations.length === 0 && !erreur && (
            <div style={styles.vide}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
              <p style={{ color: '#718096' }}>Saisissez les symptômes pour obtenir des recommandations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container:   { padding: '2rem 0' },
  titre:       { color: '#2c7a7b', marginBottom: '1.5rem', fontSize: '1.6rem' },
  grid:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  card:        { backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' },
  cardTitre:   { color: '#2c7a7b', marginBottom: '1.2rem', fontSize: '1.1rem' },
  champ:       { marginBottom: '1rem' },
  label:       { display: 'block', fontWeight: '600', marginBottom: '0.4rem', color: '#4a5568', fontSize: '0.9rem' },
  hint:        { fontWeight: '400', color: '#a0aec0', fontSize: '0.85rem' },
  select:      { width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', backgroundColor: '#fff' },
  input:       { width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none' },
  textarea:    { width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', height: '80px', outline: 'none', resize: 'vertical' },
  tags:        { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  tag:         { padding: '0.3rem 0.8rem', backgroundColor: '#e6f3f3', color: '#2c7a7b', border: '1px solid #2c7a7b', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' },
  btnGroup:    { display: 'flex', gap: '0.8rem', marginTop: '1rem' },
  btn:         { flex: 1, padding: '0.8rem', backgroundColor: '#2c7a7b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' },
  btnReset:    { padding: '0.8rem 1rem', backgroundColor: '#e2e8f0', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' },
  erreurBox:   { backgroundColor: '#fed7d7', color: '#c53030', padding: '0.8rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem' },
  successBox:  { backgroundColor: '#c6f6d5', color: '#276749', padding: '0.8rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem' },
  loadingBox:  { backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  spinner:     { fontSize: '2rem', marginBottom: '0.5rem' },
  resultTitre: { color: '#2c7a7b', marginBottom: '1rem', fontSize: '1.1rem' },
  recCard:     { backgroundColor: '#fff', borderRadius: '10px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  recHeader:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' },
  recBody:     { display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' },
  recAction:   { color: '#2d3748', lineHeight: 1.5 },
  recMatches:  { color: '#718096', fontSize: '0.85rem' },
  vide:        { backgroundColor: '#fff', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
};

export default Consultation;
