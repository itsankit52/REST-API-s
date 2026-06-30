import mongoose from "mongoose";

export interface Book {
    _id?: mongoose.Types.ObjectId;

    title: string;
    description: string;
    author: mongoose.Types.ObjectId;
    genre: string;
    coverImage: string;
    file: string;

    createdAt?: Date;
    updatedAt?: Date;
}

// 03:40:00