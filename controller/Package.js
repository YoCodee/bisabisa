import Packages from "../models/PackageModel.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getPackage = async (req, res) => {
    try {
        const response = await prisma.package.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createPackage = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newPackage = await prisma.package.create({
            data: {
                name,
                description,
                price
            }
        });
        res.status(201).json({ msg: "Package created", package: newPackage });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const getPackageById = async (req, res) => {
    try {
        const packages = await prisma.package.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!packages) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updatePackage = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const packages = await prisma.package.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!packages) {
            return res.status(404).json({ message: "Package not found" });
        }

        const updatedPackage = await prisma.package.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name,
                description,
                price
            }
        });

        res.status(200).json({ msg: "Package updated", package: updatedPackage });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deletePackage = async (req, res) => {
    try {
        const packages = await prisma.package.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!packages) {
            return res.status(404).json({ message: "Package not found" });
        }

        await prisma.package.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.status(200).json({ msg: "Package deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


