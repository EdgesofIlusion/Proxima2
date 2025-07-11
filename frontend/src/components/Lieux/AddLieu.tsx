import React, { useState } from 'react';
import { Lieu } from '../../types';
import MapComponent from '../Map/MapComponent';

interface AddLieuProps {
  onAddLieu: (lieu: Omit<Lieu, 'id'>) => void;
  onCancel: () => void;
}

const AddLieu: React.FC<AddLieuProps> = ({ onAddLieu, onCancel }) => {
  const [titre, setTitre] = useState('');
  const [ville, setVille] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [useMapSelection, setUseMapSelection] = useState(true);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validations
    if (!titre || !ville) {
      setError('Le titre et la ville sont obligatoires');
      setLoading(false);
      return;
    }

    let finalLat: number;
    let finalLng: number;

    if (useMapSelection) {
      if (!selectedLocation) {
        setError('Veuillez sélectionner un emplacement sur la carte');
        setLoading(false);
        return;
      }
      finalLat = selectedLocation.lat;
      finalLng = selectedLocation.lng;
    } else {
      // Mode manuel
      if (!manualLat || !manualLng) {
        setError('Veuillez saisir les coordonnées');
        setLoading(false);
        return;
      }

      finalLat = parseFloat(manualLat);
      finalLng = parseFloat(manualLng);

      if (isNaN(finalLat) || isNaN(finalLng)) {
        setError('Les coordonnées doivent être des nombres valides');
        setLoading(false);
        return;
      }

      if (finalLat < -90 || finalLat > 90 || finalLng < -180 || finalLng > 180) {
        setError('Coordonnées invalides (latitude: -90 à 90, longitude: -180 à 180)');
        setLoading(false);
        return;
      }
    }

    try {
      const nouveauLieu: Omit<Lieu, 'id'> = {
        titre,
        ville,
        latitude: finalLat,
        longitude: finalLng
      };

      onAddLieu(nouveauLieu);
    } catch (err) {
      setError('Erreur lors de l\'ajout du lieu');
    } finally {
      setLoading(false);
    }
  };

  const getLocationFromNavigator = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (useMapSelection) {
            setSelectedLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          } else {
            setManualLat(position.coords.latitude.toString());
            setManualLng(position.coords.longitude.toString());
          }
        },
        (error) => {
          setError('Impossible de récupérer votre position');
        }
      );
    } else {
      setError('La géolocalisation n\'est pas supportée');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90%',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>➕ Ajouter un nouveau lieu</h2>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{
            color: 'red',
            backgroundColor: '#ffebee',
            padding: '0.5rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Titre du lieu :
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="Ex: Place de la République - Lyon"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Ville :
            </label>
            <input
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="Ex: Lyon"
            />
          </div>

          {/* Mode de sélection */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Choisir l'emplacement :
            </label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={useMapSelection}
                  onChange={() => setUseMapSelection(true)}
                  style={{ marginRight: '0.5rem' }}
                />
                🗺️ Sélection sur la carte
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={!useMapSelection}
                  onChange={() => setUseMapSelection(false)}
                  style={{ marginRight: '0.5rem' }}
                />
                ⌨️ Saisie manuelle
              </label>
              <button
                type="button"
                onClick={getLocationFromNavigator}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f39c12',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                📍 Ma position
              </button>
            </div>
          </div>

          {/* Sélection sur carte */}
          {useMapSelection && (
            <div style={{ marginBottom: '2rem' }}>
              <MapComponent 
                lieux={[]} 
                onLocationSelect={handleLocationSelect}
                isSelecting={true}
                selectedLocation={selectedLocation}
              />
              {selectedLocation && (
                <div style={{
                  backgroundColor: '#e8f5e8',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  marginTop: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  ✅ Position sélectionnée : {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </div>
              )}
            </div>
          )}

          {/* Saisie manuelle */}
          {!useMapSelection && (
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Coordonnées :
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  placeholder="Latitude (ex: 45.7640)"
                />
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  placeholder="Longitude (ex: 4.8357)"
                />
              </div>
              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                Conseil : Utilisez Google Maps pour trouver les coordonnées exactes
              </small>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '4rem' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: loading ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Ajout...' : 'Ajouter le lieu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLieu;