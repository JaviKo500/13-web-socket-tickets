import { createServer } from 'http';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssServices } from './presentation/services/wss.service';


(async()=> {
  main();
})();


function main() {

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.setRoutes( AppRoutes.routes );

  const httpServer = createServer( server.app );
  WssServices.initWss( { server: httpServer } );
  server.start();
}