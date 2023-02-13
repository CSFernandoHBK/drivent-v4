import supertest from "supertest";
import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import { createEnrollmentWithAddress, createUser, createTicketTypeWithHotel, createTicket, createHotel, createRoomWithHotelId, createTicketTypeRemote, createTicketType, createTicketTypeWithoutHotel } from "../factories";
import { createBooking } from "../factories/booking-factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/booking");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 404 if no booking", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")

            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(404)
        })

        it("should respond with 200 and booking info", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id)

            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    room: expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        capacity: expect.any(Number),
                        hotelId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    })
                })
            )
        })
    })
})

describe("POST /booking", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/booking");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with 401 if ticket is remote", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({"roomId": room.id});
            expect(response.status).toBe(401)
        })

        it("should respond with 401 if ticket is not paid", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, "RESERVED")
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({"roomId": room.id});
            expect(response.status).toBe(401)
        })

        it("should respond with 401 if ticket not include hotel", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWithoutHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({"roomId": room.id});
            expect(response.status).toBe(401)
        })
        
        it("should respond with 200 and bookingId", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({"roomId": room.id});
            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                expect.objectContaining({
                    bookingId: expect.any(Number)
                })
            )
        })
    })
})
/*
describe("PUT /booking", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", async () => {
        it("", async () => {
            
        })

        it("", async () => {
            
        })
        
        it("", async () => {
            
        })
    })
})*/