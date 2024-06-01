import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";

export class TicketController {
   constructor(
      private readonly ticketService = new TicketService()
   ) {
      
   }
   public getTickets = ( req: Request, res: Response) => {
      res.status(200).json({
        tickets: this.ticketService.tickets
      });
   }
   public getLastTicketNumber = ( req: Request, res: Response) => {
      res.status(200).json({
         lastTicketNumber: this.ticketService.lastTicketNumber,
      });
   }
   public pendingTickets = ( req: Request, res: Response) => {
      res.status(200).json({
        tickets:  this.ticketService.pendingTickets
      });
   }
   public createTickets = ( req: Request, res: Response) => {
      res.status(201).json({
        ticket: this.ticketService.createTicket()
      });
   }
   public drawTicket = ( req: Request, res: Response) => {
      const { desk } = req.params; 
      res.status(200).json({
         ...this.ticketService.drawTicket( desk )
      });
   }

   public ticketFinished = ( req: Request, res: Response) => {
      const { ticketId } = req.params; 
      res.status(200).json({
         lastTicketNumber: this.ticketService.onFinishedTicket( ticketId )
      });
   }
   public workingOn = ( req: Request, res: Response) => {
      res.status(200).json({
        ticket: this.ticketService.lastWorkingOnTickets
      });
   }
}