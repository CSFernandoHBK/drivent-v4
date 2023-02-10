import bookingRepository from "@/repositories/booking-repository"

async function getBooking(userId: number){
    const result = await bookingRepository.getBooking(userId)
    return(result)
}

async function newBooking(userId: number, roomId: number){
    const result = await bookingRepository.newBooking(userId, roomId);
    return(result)
}

async function updateBooking(){
    const result = await bookingRepository.updateBooking();
    return(result)
}

const bookingService = {
    getBooking,
    newBooking,
    updateBooking
}

export default bookingService;
