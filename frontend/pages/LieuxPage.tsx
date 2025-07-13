import React, { useState, useEffect } from 'react'; 
import { api } from '../services/api'; 
 
interface Lieu { 
  id: string; 
  titre: string; 
  description: string; 
  ville: string; 
  type: string; 
  statut: string; 
} 
 
const LieuxPage: React.FC = () => { 
  const [lieux, setLieux] = useState<Lieu[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
 
  useEffect(() => { 
    const fetchLieux = async () => { 
      try { 
        const response = await api.get('/api/lieux'); 
        setLieux(response.data.data || []); 
      } catch (err) { 
        setError('Erreur lors du chargement des lieux'); 
        console.error(err); 
      } finally { 
        setLoading(false); 
      } 
    }; 
    fetchLieux(); 
  }, []); 
 
  if (loading) return <div>Chargement...</div>; 
  if (error) return <div>Erreur: {error}</div>; 
 
  return ( 
    <div className="lieux-page"> 
      <h1>Lieux de tournage</h1> 
      <div className="lieux-grid"> 
        {lieux.length === 0 ? ( 
          <p>Aucun lieu trouv‚. Soyez le premier … en ajouter un !</p> 
        ) : ( 
          lieux.map((lieu) => ( 
            <div key={lieu.id} className="lieu-card"> 
              <h3>{lieu.titre}</h3> 
              <p><strong>Ville:</strong> {lieu.ville}</p> 
              <p><strong>Type:</strong> {lieu.type}</p> 
              <p>{lieu.description}</p> 
              <span className={`statut ${lieu.statut.toLowerCase()}`}> 
                {lieu.statut} 
              </span> 
            </div> 
          )) 
        )} 
      </div> 
    </div> 
  ); 
}; 
 
export default LieuxPage; 
