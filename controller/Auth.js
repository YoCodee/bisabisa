import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email dan password diperlukan' });
        }

        // Temukan user berdasarkan email
        const user = await prisma.users.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        // Verifikasi password
        const match = await argon2.verify(user.password, password);
        if (!match) {
            return res.status(400).json({ msg: 'Password salah' });
        }

        // Set session userId
        req.session.userId = user.uuid;

        // Kirim response dengan data user
        res.status(200).json({
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Login error:', error);  // Tambahkan logging untuk debug
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
};
export const Me = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ msg: 'Mohon login ke akun anda' });
        }

        // Find user by UUID from session
        const user = await prisma.users.findUnique({
            where: { uuid: req.session.userId },
            select: { uuid: true, name: true, email: true, role: true }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
};

export const logOut = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(400).json({ msg: 'Tidak dapat logout' });
            }
            res.status(200).json({ msg: 'Anda telah logout' });
        });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
};
