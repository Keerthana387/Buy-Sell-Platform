import mongoose from "mongoose";
import Review from "../models/review.model.js";
import jwt from 'jsonwebtoken';

export const createReview= async(req,res)=> {
	const authHeader= req.headers.authorization;
	if(!authHeader || !authHeader.startsWith("Bearer ")){
		return res.status(401).json({success: false, message: "No token provides or invalid format"});
	}

	const token= authHeader.split(" ")[1];
    try{
		const decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

		// redisClient.get(token, (err,reply)=> {
		// 	if(err){
		// 		return res.status(500).json({success: false, message: "Redis error"});
		// 	}
		// 	if(reply){
		// 		return res.status(403).json({success: false, message: "Token is blacklisted"});
		// 	}
		// })

        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
			return res.status(404).json({ success: false, message: "Invalid User Id" });
		}

		const review= req.body; //review will send this data

    	//check all conditions
    	if (!review.SellerID || !review.rating || !review.comment) {
			return res.status(400).json({ success: false, message: "Please provide all fields" });
		}
		const args={...review, reviewerID: decoded.id};
    	const newReview= new Review(args);

		try{
			await newReview.save();
			res.status(201).json({ success: true, data: newReview });
		} catch(err){
			console.error("Error in Create Review:", err.message);
			res.status(500).json({ success: false, message: "Server Error" });
		}

    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }

}

export const updateReview = async(req,res)=> {
	const {id}= req.params;
	const review= req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid review Id" });
	}

	try {
		const updatedReview = await Review.findByIdAndUpdate(id, review, { new: true });
		res.status(200).json({ success: true, data: updatedReview });
	} catch (err) {
        console.error("Error in update Review:", err.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteReview= async(req,res)=> {
	const {id}= req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Review Id" });
	}

	try {
		await Review.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Review deleted" });
	} catch (err) {
		console.log("error in deleting Review:", err.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getReviews= async(req,res) => {
	const authHeader= req.headers.authorization;
	if(!authHeader || !authHeader.startsWith("Bearer ")){
		return res.status(401).json({success: false, message: "No token provides or invalid format"});
	}

	const token= authHeader.split(" ")[1];
    try{
		const decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

		// redisClient.get(token, (err,reply)=> {
		// 	if(err){
		// 		return res.status(500).json({success: false, message: "Redis error"});
		// 	}
		// 	if(reply){
		// 		return res.status(403).json({success: false, message: "Token is blacklisted"});
		// 	}
		// })

        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
			return res.status(404).json({ success: false, message: "Invalid User Id" });
		}

		try{
			const reviews = await Review.find({ SellerID: decoded.id });
        	if (reviews.length === 0) {
            	return res.status(404).json({ success: true, message: "No reviews found for this seller." });
        	}
        	return res.status(200).json({ success: true, data: reviews });
		} catch(err){
			console.error("Error in fetching Reviews:", err.message);
			res.status(500).json({ success: false, message: "Server Error" });
		}

    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
};