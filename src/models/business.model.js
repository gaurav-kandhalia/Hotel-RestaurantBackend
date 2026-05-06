import mongoose, { Schema } from "mongoose";

const businessSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["hotel", "restaurant", "hybrid"],
            required: true
        },

        location: {
            type: String,
            trim: true
        },

        contact: {
            type: String,
            required: true,
            trim: true
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Business = mongoose.model("Business", businessSchema);