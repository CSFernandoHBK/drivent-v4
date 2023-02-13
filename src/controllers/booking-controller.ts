import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import ticketService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    try{
        const response = await bookingService.getBooking(Number(userId))
        return res.send(response)
    } catch(err){
        if(err.name === "NotFoundError"){
            return res.status(404).send(err.message)
        }
        return res.status(500).send(err)
    }
}

export async function newBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    const {roomId} = req.body;

    try{
        const ticket = await ticketService.getTicketByUserId(userId)
        if(ticket.status==="RESERVED"){
            return res.status(401).send("The ticket is not paid")
        } 
        if(ticket.TicketType.isRemote){
            return res.status(401).send("The ticket is for remote event only")
        }
        if(!ticket.TicketType.includesHotel){
            return res.status(401).send("The ticket do not include hotel")
        }
        const response = await bookingService.newBooking(Number(userId), Number(roomId));
        return res.status(200).send({bookingId: response.id})
    } catch(err){
        console.log(err)
        if(err.name === "NotFoundError"){
            return res.status(404).send(err.message)
        }
        if(err.Error === "403"){
            return res.status(403).send("Room full!")
        }
        return res.status(500).send(err)
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    const {roomId} = req.body;

    if(!roomId){
        return res.status(404).send("roomId was not sent!")
    }

    try{
        const response = await bookingService.updateBooking(Number(roomId), Number(userId))
        return res.send(response)
    } catch(err){
        if(err.name === "NotFoundError"){
            return res.status(404).send(err.message)
        }
        console.log(err)
        return res.status(500).send(err)
    }
}