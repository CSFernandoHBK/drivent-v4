import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";

export async function getBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    try{
        const response = await bookingService.getBooking()
        return res.send(response)
    } catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
}

export async function newBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    try{
        const response = await bookingService.newBooking();
        return res.send(response)
    } catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    try{
        const response = await bookingService.updateBooking()
        return res.send(response)
    } catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
}