import { app, prisma, config } from './app'; 
 
const startServer = async () => { 
  try { 
    await prisma.$connect(); 
    console.log('? Base de donn‚es connect‚e'); 
    const server = app.listen(config.port, () => { 
      console.log(`?? Serveur d‚marr‚ sur http://localhost:${config.port}`); 
    }); 
    return server; 
  } catch (error) { 
    console.error('? Erreur:', error); 
    process.exit(1); 
  } 
}; 
 
startServer(); 
