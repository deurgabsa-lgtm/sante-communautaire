import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

function Patients() {
  const [patients, setPatients]   = useState([]);
  const [form, setForm]           = useState({ nom: '', prenom: '', age: '', village: '' });
  const [message, setMessage]     = useState('');
  const [erreur, setErreur]       = useState('');
  const [chargement, setChargement] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [editId, setEditId]       = useState(null);

  useEffect(() => {
    chargerPatients();
  }, []);

  const chargerPatients = () => {
    axios.get(`${API}/patients/`)
      .then(res => setPatients(res.data))
      .catch(() => setErreur('Impossible de charger les patients. Vérifiez que le serveur Django est démarré.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');

    const action = editId
      ? axios.put(`${API}/patients/${editId}/`, form)
      : axios.post(`${API}/patients/`, form);

    action
      .then(res => {
        if (editId) {
          setPatients(patients.map(p => p.id === editId ? res.data : p));
          setMessage('Patient modifié avec succès !');
          setEditId(null);
        } else {
          setPatients([...patients, res.data]);
          setMessage('Patient ajouté avec succès !');
        }
        setForm({ nom: '', prenom: '', age: '', village: '' });
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(() => setErreur('Erreur lors de la sauvegarde.'))
      .finally(() => setChargement(false));
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ nom: p.nom, prenom: p.prenom, age: p.age, village: p.village });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce patient ?')) return;
    axios.delete(`${API}/patients/${id}/`)
      .then(() => setPatients(patients.filter(p => p.id !== id)))
      .catch(() => setErreur('Erreur lors de la suppression.'));
  };

  const handleAnnuler = () => {
    setEditId(null);
    setForm({ nom: '', prenom: '', age: '', village: '' });
  };

  const patientsFiltres = patients.filter(p =>
    `${p.nom} ${p.prenom} ${p.village}`.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.titre}> Gestion des Patients</h2>

      {/* Formulaire */}
      <div style={styles.card}>
        <h3 style={styles.cardTitre}>
          {editId ? ' Modifier le patient' : ' Ajouter un patient'}
        </h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Nom *"
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            style={styles.input}
            required
          />
          <input
            placeholder="Prénom *"
            value={form.prenom}
            onChange={e => setForm({ ...form, prenom: e.target.value })}
            style={styles.input}
            required
          />
          <input
            placeholder="Âge *"
            type="number"
            min="0"
            max="150"
            value={form.age}
            onChange={e => setForm({ ...form, age: e.target.value })}
            style={styles.inputSmall}
            required
          />
          <input
            placeholder="Village / Quartier"
            value={form.village}
            onChange={e => setForm({ ...form, village: e.target.value })}
            style={styles.input}
          />
          <div style={styles.btnGroup}>
            <button type="submit" style={styles.btn} disabled={chargement}>
              {chargement ? ' Sauvegarde...' : editId ? '✔ Modifier' : ' Ajouter'}
            </button>
            {editId && (
              <button type="button" onClick={handleAnnuler} style={styles.btnAnnuler}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Messages */}
      {message && <div style={styles.success}>✅ {message}</div>}
      {erreur   && <div style={styles.error}>❌ {erreur}</div>}

      {/* Recherche */}
      <div style={styles.rechercheWrap}>
        <input
          placeholder=" Rechercher un patient..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={styles.rechercheInput}
        />
        <span style={styles.compteur}>{patientsFiltres.length} patient(s)</span>
      </div>

      {/* Tableau */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Nom</th>
              <th style={styles.th}>Prénom</th>
              <th style={styles.th}>Âge</th>
              <th style={styles.th}>Village</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patientsFiltres.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.vide}>Aucun patient trouvé</td>
              </tr>
            ) : (
              patientsFiltres.map((p, i) => (
                <tr key={p.id} style={i % 2 === 0 ? styles.trPair : styles.trImpair}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}><strong>{p.nom}</strong></td>
                  <td style={styles.td}>{p.prenom}</td>
                  <td style={styles.td}>{p.age} ans</td>
                  <td style={styles.td}>{p.village || '—'}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleEdit(p)} style={styles.btnEdit}></button>
                    <button onClick={() => handleDelete(p.id)} style={styles.btnDel}></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container:    { padding: '2rem 0' },
  titre:        { color: '#2c7a7b', marginBottom: '1.5rem', fontSize: '1.6rem' },
  card:         { backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTitre:    { color: '#2c7a7b', marginBottom: '1rem', fontSize: '1.1rem' },
  form:         { display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'flex-end' },
  input:        { padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', minWidth: '160px', outline: 'none' },
  inputSmall:   { padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', width: '100px', outline: 'none' },
  btnGroup:     { display: 'flex', gap: '0.5rem' },
  btn:          { padding: '0.6rem 1.5rem', backgroundColor: '#2c7a7b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' },
  btnAnnuler:   { padding: '0.6rem 1.2rem', backgroundColor: '#e2e8f0', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' },
  success:      { backgroundColor: '#c6f6d5', color: '#276749', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '500' },
  error:        { backgroundColor: '#fed7d7', color: '#c53030', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '500' },
  rechercheWrap:{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  rechercheInput:{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', width: '300px', outline: 'none' },
  compteur:     { color: '#718096', fontSize: '0.9rem' },
  tableWrap:    { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table:        { width: '100%', borderCollapse: 'collapse' },
  thead:        { backgroundColor: '#2c7a7b' },
  th:           { color: '#fff', padding: '0.9rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.9rem' },
  td:           { padding: '0.8rem 1rem', fontSize: '0.95rem' },
  trPair:       { borderBottom: '1px solid #edf2f7', backgroundColor: '#fff' },
  trImpair:     { borderBottom: '1px solid #edf2f7', backgroundColor: '#f7fafc' },
  vide:         { padding: '2rem', textAlign: 'center', color: '#718096' },
  btnEdit:      { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', marginRight: '0.5rem' },
  btnDel:       { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' },
};

export default Patients;
