import { prisma } from "@/config";
import dayjs from "dayjs";

async function getBooking(userId: number){
    const result = prisma.booking.findFirst({
        where:{
            userId: userId
        }
    })
    return(result)
}

async function newBooking(userId: number, roomId: number){
    const result = prisma.booking.create({
        data:{
            userId: userId,
            roomId: roomId,
            updatedAt: dayjs().toDate()
        }
    })
    return(result)
}

async function updateBooking(){
    const result = ""
    return(result)
}

const bookingRepository = {
    getBooking,
    newBooking,
    updateBooking
}

export default bookingRepository;