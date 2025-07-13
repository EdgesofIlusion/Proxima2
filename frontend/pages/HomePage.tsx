import React from 'react'; 
 
const HomePage: React.FC = () => { 
  return ( 
    <div className="home-page"> 
      <h1>Bienvenue sur Proxima</h1> 
      <p>Trouvez et partagez les meilleurs lieux de tournage</p> 
      <div className="features"> 
        <div className="feature"> 
          <h3>?? Recherche avanc‚e</h3> 
          <p>Filtrez par type, ville, accessibilit‚</p> 
        </div> 
        <div className="feature"> 
          <h3>?? Galerie photos</h3> 
          <p>Visualisez les lieux en d‚tail</p> 
        </div> 
        <div className="feature"> 
          <h3>?? Commentaires</h3> 
          <p>Partagez vos exp‚riences</p> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default HomePage; 
