import mongoose from "mongoose";

const userSchema= new mongoose.Schema(
    {
        First_Name: {
            type: String,
            required: true
        },
        Last_Name: {
            type: String,
            required: true
        },
        Email: {
            //only iiit emails allowed
            type: String,
            required: true,
            unique: true
        },
        Age: {
            type: Number,
            required: true
        },
        Contact_Number: {
            type: Number,
            required: true
        },
        Password: {
            //Hashed Password
            type: String,
            required: true
        },
        Cart: {
            //array of items
            type: [mongoose.Schema.Types.ObjectId],
            ref: "item",
            //required: false
        }
    },
    { timestamps: true}
);

const User= mongoose.model("user", userSchema);

export default User;