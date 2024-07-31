import express from 'express';
import {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    updateBookingStatus,
    userBooking
} from '../controller/Booking.js';

import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/booking',  verifyUser, createBooking);
router.get('/booking', verifyUser , getBookings);
router.get("/userBooking", verifyUser, userBooking);
router.get('/bookingById/:id',verifyUser , getBookingById);
router.put('/bookings/:id', verifyUser,updateBooking);
router.delete('/deleteBooking/:id', verifyUser,deleteBooking);
router.put('/booking/:id/status', adminOnly , updateBookingStatus);

export default router;
