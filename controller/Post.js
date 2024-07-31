import Users from "../models/UserModel.js";
import Posts from "../models/PostModel.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
    const { title, price, images, address, city, latitude, longitude, description, category } = req.body;
    try {
        const post = await prisma.post.create({
            data: {
                title,
                price,
                images,
                address,
                city,
                latitude,
                longitude,
                description,
                category,
                userId: req.userId // Assume req.userId is set after authentication
            }
        });
        res.status(201).json({ msg: "Post created", post });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getPostById = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { user: true } // Include related user data
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { title, price, images, address, city, latitude, longitude, description, category } = req.body;

    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const updatedPost = await prisma.post.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title,
                price,
                images,
                address,
                city,
                latitude,
                longitude,
                description,
                category
            }
        });

        res.status(200).json({ message: "Post updated", post: updatedPost });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    const postId = parseInt(req.params.id);
    console.log(`Attempting to delete post with ID: ${postId}`);

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            console.log("Post not found");
            return res.status(404).json({ message: "Post not found" });
        }

        await prisma.post.delete({
            where: { id: postId }
        });

        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: error.message });
    }
};