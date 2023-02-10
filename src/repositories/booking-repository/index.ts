import { prisma } from "@/config";
import dayjs from "dayjs";

async function getBooking(userId: number){
    const book = prisma.booking.findFirst({
        where:{
            userId: userId
        }
    })
    const room = prisma.room.findFirst({
        where:{
            id: (await book).roomId
        }
    })
    return({
        id: (await book).id,
        room: await room
    })
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