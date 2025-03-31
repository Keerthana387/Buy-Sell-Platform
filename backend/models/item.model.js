import mongoose from "mongoose";

const itemSchema= new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true
        },
        Price: {
            type: Number,
            required: true
        },
        Description: {
            type: String,
            required: true
        },
        Category: {
            type: String,
            required: true
        },
        SellerID: {
            //Link to Seller(User)
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        Stock: {
            type: Number,
            required: true,
            default: 1
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        image: {
            type: String,
            required: true,
        }
    },
    { timestamps: true}
);

const Item= mongoose.model("item", itemSchema);

export default Item;