import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository"
import hotelRepository from "@/repositories/hotel-repository";

async function getBooking(userId: number){
    const result = await bookingRepository.getBooking(userId)
    return(result)
}

async function newBooking(userId: number, roomId: number){
    const roomData = await hotelRepository.findRoomById(roomId);
    if(!roomData){
        throw notFoundError();
    }
    const bookings: number = await howManyBookings(roomId)
    if(roomData.capacity === bookings){
        throw Error("403")
    }
    const result = await bookingRepository.newBooking(userId, roomId);
    return result
}

async function updateBooking(roomId: number, userId: number){
    // Verificar se o usuário possui reserva
    const cond = await getBooking(userId);
    // Verificar se o quarto está livre 
    const result = await bookingRepository.updateBooking(roomId);
    return(cond)
}

async function howManyBookings(roomId: number) {
    const bookings = await bookingRepository.getBookingsByRoomId(roomId)
    return(bookings.length)
}

const bookingService = {
    getBooking,
    newBooking,
    updateBooking
}

export default bookingService;
