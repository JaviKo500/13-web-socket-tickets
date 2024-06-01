import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

interface Options {
   server: Server;
   path?: string;
}

export class WssServices {
   private static _instance: WssServices;

   private wss: WebSocketServer;

   private constructor( options: Options ) {
      const { server, path = '/ws' } = options;
      this.wss = new WebSocketServer( { server, path } );
   }

   static get instance(): WssServices {
      if (!WssServices._instance) {
         throw 'WssService is not initialized';
      }

      return WssServices._instance;
   }

   static initWss( options: Options ) {
      WssServices._instance = new WssServices( options );
   }

   public start(){
      this.wss.on( 'connection', ( ws: WebSocket) => {
         console.log('<--------------- JK Wss.services --------------->');
         console.log('client connection');
         ws.on( 'close', () => console.log('Client disconnected'));
      });
   }
}