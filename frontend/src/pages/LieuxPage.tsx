import React, { useState, useEffect } from 'react'; 
import { api } from '../services/api'; 
 
const LieuxPage: React.FC = () => { 
  const [lieux, setLieux] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [rawData, setRawData] = useState<any>(null); 
 
  useEffect(() => { 
    const fetchLieux = async () => { 
      try { 
        console.log('🔄 Appel API /api/lieux...'); 
        const response = await api.get('/api/lieux'); 
        console.log('📋 Réponse API:', response.data); 
        setRawData(response.data); 
        setLieux(response.data.data?.lieux || []); 
      } catch (err: any) { 
        console.error('❌ Erreur API:', err); 
        setError(`Erreur: ${err.message}`); 
      } finally { 
        setLoading(false); 
      } 
    }; 
    fetchLieux(); 
  }, []); 
 
  return ( 
    <div style={{padding: '2rem'}}> 
      <h1>🎬 Lieux de tournage</h1> 
      {loading && <p>🔄 Chargement...</p>} 
      {error && <p style={{color: 'red'}}>❌ {error}</p>} 
      {rawData && ( 
        <details> 
          <summary>📋 Données brutes API</summary> 
          <pre>{JSON.stringify(rawData, null, 2)}</pre> 
        </details> 
      )} 
      {lieux.length > 0 && ( 
        <div> 
          <h2>✅ {lieux.length} lieu(x) trouvé(s)</h2> 
          {lieux.map((lieu, index) => ( 
            <div key={index} style={{border: '1px solid #ccc', padding: '1rem', margin: '1rem 0'}}> 
              <h3>{lieu.titre}</h3> 
              <p>Ville: {lieu.ville}</p> 
            </div> 
          ))} 
        </div> 
      )} 
    </div> 
  ); 
}; 
 
export default LieuxPage; 
