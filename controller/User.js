import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                uuid: true,
                name: true,
                email: true,
                role: true
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password tidak cocok" });
    }

    try {
        const hash = await argon2.hash(password);

        await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: hash,
                role: role || 'user' // Set default role if not provided
            }
        });

        res.status(201).json({ msg: "Pendaftaran berhasil!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, confPassword, role } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { uuid: id }
        });

        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        if (password && password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });

        const hashPassword = password ? await argon2.hash(password) : user.password;

        await prisma.user.update({
            where: { uuid: id },
            data: {
                name: name,
                email: email,
                password: hashPassword,
                role: role
            }
        });

        res.status(200).json({ msg: "User diperbarui" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


export const deleteUser = async(req, res) =>{
    const user = await Users.findOne({
        where: {
            uuid : req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    try {
        await Users.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg : error.message})
    }
}

export const getUserById = async(req, res) =>{
    try {
        const respone = await Users.findOne({
            attributes:['uuid', 'name', 'email', 'role'],
            where: {
                uuid : req.params.id
            }
        });
        res.status(200).json(respone);
    } catch (error) {
        res.status(500).json({msg : error.message})
    }
}