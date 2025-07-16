import React, { useState, useEffect } from 'react';
import { lieuxAPI, Lieu } from '../services/api';

const LieuxPage: React.FC = () => {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLieux = async () => {
      setLoading(true);
      const data = await lieuxAPI.getAll();
      setLieux(data);
      setLoading(false);
    };

    loadLieux();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-primary">Chargement des lieux...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Nos lieux ({lieux.length})
        </h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
          Filtrer
        </button>
      </div>

      {/* Liste des lieux */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lieux.map((lieu) => (
          <div key={lieu.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">📸 {lieu.type}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                {lieu.titre}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                📍 {lieu.ville}
              </p>
              <p className="text-gray-600 text-sm mb-3">
                {lieu.description.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold">€{lieu.prix_jour}/jour</span>
                <button className="text-primary hover:text-primary-dark">
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lieux.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun lieu disponible pour le moment.
        </div>
      )}
    </div>
  );
};

export default LieuxPage;