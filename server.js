const { createServer } = require('node:http');
const next = require('next');

const port = Number.parseInt(process.env.PORT || '3000', 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = createServer((request, response) => handle(request, response));

    // cPanel/Passenger fournit automatiquement le port dans process.env.PORT.
    // Ne pas imposer HOSTNAME : certains serveurs cPanel utilisent un nom non liant.
    server.listen(port, () => {
      console.log(`Linkstech est disponible sur le port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Le démarrage de Linkstech a échoué :', error);
    process.exit(1);
  });
