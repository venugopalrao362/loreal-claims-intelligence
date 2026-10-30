import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [claimId, setClaimId] = useState('sample-claim-001');
  const [evidenceText, setEvidenceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAssessment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/claims/assess', {
        claimId,
        evidenceText
      });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '25px', border: '1px solid #e0e0e0', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#111' }}>L'Oréal Claims Intelligence Engine</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>Research & Innovation (R&I) Clinical Study Validation Portal</p>

      <form onSubmit={handleAssessment} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>Claim ID:</label>
          <input
            type="text"
            value={claimId}
            onChange={(e) => setClaimId(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>Clinical Trial Evidence / Results:</label>
          <textarea
            value={evidenceText}
            onChange={(e) => setEvidenceText(e.target.value)}
            placeholder="e.g., Double-blind study of 50 subjects showed 21% wrinkle reduction over 4 weeks..."
            rows={5}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Evaluating Claim with AI...' : 'Run Assessment'}
        </button>
      </form>

      {error && <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#ffe6e6', color: '#c00', borderRadius: '6px', fontSize: '14px' }}>{error}</div>}

      {result && (
        <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f9f9f9', borderLeft: `5px solid ${result.isJustified ? '#28a745' : '#dc3545'}`, borderRadius: '6px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Assessment Result</h3>
          <p><strong>Justified:</strong> <span style={{ color: result.isJustified ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>{result.isJustified ? 'YES' : 'NO'}</span></p>
          <p><strong>Confidence Score:</strong> {(result.confidenceScore * 100).toFixed(1)}%</p>
          <p style={{ margin: '10px 0 5px 0' }}><strong>Scientific Reasoning:</strong></p>
          <p style={{ backgroundColor: '#fff', padding: '12px', border: '1px solid #eee', borderRadius: '4px', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{result.reasoning}</p>
        </div>
      )}
    </div>
  );
}