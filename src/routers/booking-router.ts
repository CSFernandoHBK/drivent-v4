import { getBooking, newBooking, updateBooking } from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter
    .all("/*", authenticateToken)
    .get("/", getBooking)
    .post("/", newBooking)
    .put("/", updateBooking)

export {bookingRouter}