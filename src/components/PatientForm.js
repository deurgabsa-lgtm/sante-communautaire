import React from 'react';

// Composant réutilisable pour le formulaire patient
function PatientForm({ form, setForm, onSubmit, editMode, onAnnuler, chargement }) {
  return (
    <form onSubmit={onSubmit} style={styles.form}>
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
          {chargement ? '⏳...' : editMode ? '✔ Modifier' : '➕ Ajouter'}
        </button>
        {editMode && (
          <button type="button" onClick={onAnnuler} style={styles.btnAnnuler}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  form:       { display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'flex-end' },
  input:      { padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', minWidth: '150px', outline: 'none' },
  inputSmall: { padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', width: '90px', outline: 'none' },
  btnGroup:   { display: 'flex', gap: '0.5rem' },
  btn:        { padding: '0.6rem 1.4rem', backgroundColor: '#2c7a7b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  btnAnnuler: { padding: '0.6rem 1rem', backgroundColor: '#e2e8f0', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};

export default PatientForm;
