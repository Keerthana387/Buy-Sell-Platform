import mongoose from "mongoose";
const Schema= mongoose.Schema;

const reviewSchema= new Schema({
    SellerID: {
        //refes to seller
        type: mongoose.Schema.Types.ObjectId,
        refPath: "user",
        required: true
    },
    reviewerID: {
        //refers to buyer
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: false
    },
}, { timestamps: true});

//make a model for Schema
const Review= mongoose.model('review', reviewSchema);

//export the model 
export default Review;