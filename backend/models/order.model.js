import mongoose from "mongoose";

const orderSchema= new mongoose.Schema(
    {
        ItemID: {
            //link to the item
            type: mongoose.Schema.Types.ObjectId,
            ref: "item",
            required: true
        },
        BuyerID: {
            //Link to Buyer(User)
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        SellerID: {
            //Link to Seller(User)
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        Amount: {
            type: Number,
            required: true,
        },
        HashedOTP: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    { timestamps: true}
);

const Order= mongoose.model("order", orderSchema);

export default Order;