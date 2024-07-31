import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateBookingCode = async () => {
    const prefix = 'BOOK-JWD-';
    
    // Find the latest booking with the same prefix
    const latestBooking = await prisma.booking.findFirst({
      where: {
        bookingCode: {
          startsWith: prefix
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  
    // Extract the sequence number and increment it
    let sequenceNumber = 1;
    if (latestBooking) {
      const lastCode = latestBooking.bookingCode;
      const match = lastCode.match(/BOOK-JWD-(\d+)/);
      if (match) {
        sequenceNumber = parseInt(match[1], 10) + 1;
      }
    }
  
    // Format the new booking code
    const newCode = `${prefix}${sequenceNumber.toString().padStart(3, '0')}`;
    return newCode;
  };
  
  export const createBooking = async (req, res) => {
    const { userId, postId, packageId, name, phone, visitDate, numberOfPeople, additionalNotes, totalDays } = req.body;

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        const packageItem = await prisma.package.findUnique({
            where: { id: packageId }
        });

        if (!post || !packageItem) {
            return res.status(404).json({ error: 'Post or Package not found.' });
        }

        // Format visitDate as ISO-8601 if it's a string
        const formattedVisitDate = new Date(visitDate).toISOString();

        // Generate booking code
        const bookingCount = await prisma.booking.count();
        const bookingCode = `BOOK-JWD-${String(bookingCount + 1).padStart(3, '0')}`;

        const totalPrice = (post.price + packageItem.price) * numberOfPeople * totalDays;

        await prisma.booking.create({
            data: {
                userId: req.userId,
                postId,
                packageId,
                name,
                phone,
                status: 'Pending',
                visitDate: formattedVisitDate,  // Ensure correct format
                numberOfPeople,
                additionalNotes,
                totalDays,
                totalPrice,
                bookingCode,
                bookingDate: new Date()  // Set the current date
            }
        });

        res.status(201).json({ msg: "Booking created" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: error.message });
    }
}

export const getBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: true,
                post: true,
                package: true
            }
        });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const userBooking = async (req, res) => {
    try {
        const userId = req.userId;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                user: true,
                post: true,
                package: true
            }
        });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                user: true,
                post: true,
                package: true
            }
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBooking = async (req, res) => {
    const { name, postId, phone, status, packageId, visitDate, numberOfPeople, additionalNotes, TotalDays } = req.body;

    try {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        const packageItem = await prisma.package.findUnique({ where: { id: packageId } });
        const booking = await prisma.booking.findUnique({ where: { id: Number(req.params.id) } });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const totalPrice = (post.price + packageItem.price) * numberOfPeople * TotalDays;

        await prisma.booking.update({
            where: { id: Number(req.params.id) },
            data: {
                name,
                phone,
                status,
                visitDate,
                numberOfPeople,
                additionalNotes,
                TotalDays,
                totalPrice
            }
        });

        res.status(200).json({ message: "Booking updated" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({ where: { id: Number(req.params.id) } });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await prisma.booking.delete({ where: { id: Number(req.params.id) } });

        res.status(200).json({ message: "Booking deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({ where: { id: Number(req.params.id) } });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await prisma.booking.update({
            where: { id: Number(req.params.id) },
            data: { status: 'Success' }
        });

        res.status(200).json({ message: "Booking status updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
