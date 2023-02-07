import bookingRepository from "@/repositories/booking-repository"

async function getBooking(){
    const result = await bookingRepository.getBooking()
    return(result)
}

async function newBooking(){
    const result = await bookingRepository.newBooking();
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
