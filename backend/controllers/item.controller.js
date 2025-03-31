import mongoose from "mongoose";
import Item from "../models/item.model.js";
import jwt from 'jsonwebtoken';

export const getItems= async(req,res)=> {
	const { categories, name, id, sellerId}= req.query;
	const authHeader= req.headers.authorization;
	let query= {};

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
		if(categories){
			query.Category= {$in: categories.split(",")};
		}
		if(name){
			query.Name= { $regex: name, $options: "i"}; //case insensitive
		}
		if(id){
			if (!mongoose.Types.ObjectId.isValid(id)) {
				return res.status(400).json({ success: false, message: "Invalid Item ID" });
			}
			query._id = id;
		}
		if(sellerId){
			query.SellerID = decoded.id;
		}
		if(!categories && !name && !id && !sellerId){
			query= {}
		}
		try{
			const items= await Item.find(query);
			if (items.length === 0) {
				return res.status(404).json({ success: false, message: "No items found" });
			}
			console.log(items);
			return res.status(200).json({ success: true, data: items, message: "Items fetched successfully"});
		} catch(err){
			console.log("Error in fetching Items: ", err.message);
			return res.status(500).json({ success: false, message: `${err.message}`});
		}
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
}

export const createItem= async(req,res)=> {
    const item= req.body; //user will send this data
	//check all conditions
    if (!item.Name || !item.Price || !item.Description || !item.Category || !item.Stock || !item.isActive || !item.image) {
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}

	const authHeader= req.headers.authorization;
	if(!authHeader || !authHeader.startsWith("Bearer ")){
		return res.status(401).json({success: false, message: "No token provides or invalid format"});
	}

	const token= authHeader.split(" ")[1];

	try{
		const decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
		
		item.SellerID=decoded.id;

		const newItem= new Item(item);

    	try{
        	await newItem.save();
        	return res.status(201).json({ success: true, data: newItem, message: "Item created successfully" });
    	} catch(err){
        	console.error("Error in Create Item:", err.message);
			return res.status(500).json({ success: false, message: `${err.message}` });
    	}

	} catch{
		console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
	}
}

export const updateItem = async(req,res)=> {
	const {id}= req.params;
	const item= req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Item Id" });
	}

	try {
		if(item.hasOwnProperty("Stock")){
			if(item.Stock>0){
				item.isActive=true;
			} else{
				item.isActive=false;
			}
		}
		const updatedItem = await Item.findByIdAndUpdate(id, item, { new: true });
		return res.status(200).json({ success: true, data: updatedItem, message: "Item data updated successfully" });
	} catch (err) {
        console.error("Error in update Item:", err.message);
		return res.status(500).json({ success: false, message: `${err.message}` });
	}
};

export const deleteItem= async(req,res)=> {
	const {id}= req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Item Id" });
	}

	try {
		await Item.findByIdAndDelete(id);
		return res.status(200).json({ success: true, message: "Item deleted successfully" });
	} catch (err) {
		console.log("error in deleting Item:", err.message);
		return res.status(500).json({ success: false, message: `${err.message}` });
	}
};