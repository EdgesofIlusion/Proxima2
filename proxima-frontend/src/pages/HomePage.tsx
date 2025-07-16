import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4">
          Trouvez le lieu parfait pour votre tournage
        </h1>
        <p className="text-xl text-blue-100 mb-6">
          Des châteaux aux lofts industriels, découvrez des lieux exceptionnels
        </p>
        <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
          Explorer les lieux
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-primary">500+</div>
          <div className="text-gray-600">Lieux disponibles</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-primary">1000+</div>
          <div className="text-gray-600">Tournages réalisés</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-primary">98%</div>
          <div className="text-gray-600">Satisfaction client</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;