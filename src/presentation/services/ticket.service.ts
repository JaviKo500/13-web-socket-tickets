import { v4 } from "uuid";
import { UuidAdapters } from "../../config/adapters/uuid.adapters";
import { Ticket } from "../../domain/interfaces/ticket";

export class TicketService {
   public readonly tickets: Ticket [] = [
      {
         id: UuidAdapters.v4(),
         number: 1,
         createdAt: new Date(),
         done: false
      },
      {
         id: UuidAdapters.v4(),
         number: 2,
         createdAt: new Date(),
         done: false
      },
      {
         id: UuidAdapters.v4(),
         number: 3,
         createdAt: new Date(),
         done: false
      },
      {
         id: UuidAdapters.v4(),
         number: 4,
         createdAt: new Date(),
         done: false
      },
      {
         id: UuidAdapters.v4(),
         number: 5,
         createdAt: new Date(),
         done: false
      },
      {
         id: UuidAdapters.v4(),
         number: 6,
         createdAt: new Date(),
         done: false
      },
   ];

   private readonly workingOnTickets: Ticket[] = [];

   public get pendingTickets (): Ticket [] {
      return this.tickets.filter( ticket => !ticket.handleAtDesk && !ticket.done );
   }

   public get lastWorkingOnTickets (): Ticket[] {
      return this.workingOnTickets.slice( 0, 4 );
   }

   public get lastTicketNumber(): number {
      return this.tickets.length > 0 ? this.tickets.at(-1)?.number ?? 0 : 0;
   }

   public createTicket() {
      const ticket: Ticket = {
         id: v4(),
         number: this.lastTicketNumber + 1,
         done: false,
         createdAt: new Date(),
      };
      this.tickets.push( ticket );
      return ticket;
   }

   public drawTicket( desk: string ) {
      const ticket = this.tickets.find( t => !t.handleAtDesk );
      if ( !ticket ) return { status: 'error', message: 'No hay tickets pendientes' };

      ticket.handleAt = new Date();
      ticket.handleAtDesk = desk;

      this.workingOnTickets.unshift( {...ticket} );
      // TODO ws
      return {
         status: 'ok',
         ticket
      };
   }

   public onFinishedTicket ( id: string ) {
      const ticket = this.tickets.find( t => t.id ===id );
      if ( !ticket ) return { status: 'error', message: 'No se ha encontrado ese ticket' };

      this.tickets.map( ticket => {
         if ( ticket.id === id ) {
            ticket.done;
         }
         return ticket;
      });
      return { status: 'ok' };
   }
}