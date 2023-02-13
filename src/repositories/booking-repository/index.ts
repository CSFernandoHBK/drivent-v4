import { prisma } from "@/config";
import { notFoundError } from "@/errors";
import dayjs from "dayjs";

async function getBooking(userId: number){
    const book = await prisma.booking.findFirst({
        where:{
            userId: userId
        }
    })

    if(!book){
        throw notFoundError();
    }

    const room = await prisma.room.findFirst({
        where:{
            id: book.roomId
        }
    })
    return({
        id: book.id,
        room: room
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

async function updateBooking(roomId: number){
    const result = ""
    return(result)
}

async function getBookingsByRoomId(roomId: number) {
    return prisma.booking.findMany({
        where:{
            roomId: roomId
        }
    })
}

const bookingRepository = {
    getBooking,
    newBooking,
    updateBooking,
    getBookingsByRoomId
}

export default bookingRepository;