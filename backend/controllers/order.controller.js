import mongoose from "mongoose";
import User from "../models/user.model.js";
import Item from "../models/item.model.js";
import jwt from 'jsonwebtoken';
import Order from "../models/order.model.js";
import bcrypt from 'bcryptjs';

export const createOrder= async(req,res)=> {
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

        const user= await User.findById(decoded.id).select("-Password");
		if(!user){
			return res.status(404).json({success: false, message: "User not found"});
		}
    
        const items= user.Cart;
        if(!items || items.length===0){
            return res.status(400).json({success: false, message: "Cart is empty"});
        }

        const itemDetails= await Item.find({_id: {$in: items}});

        const orders= itemDetails.map((item)=> ({
            ItemID: item._id,
            BuyerID: decoded.id,
            SellerID: item.SellerID,
            Amount: item.Price,
            HashedOTP: "none",
        }));

        await Order.insertMany(orders);

        const validItemIds= itemDetails.map((item)=> item._id);
        const updatedUser= await User.findByIdAndUpdate(decoded.id,{$pull: {Cart: {$in: validItemIds}}}, {new: true});

        for(const item of itemDetails){
            item.Stock-=1;
            if(item.Stock <=0){
                item.isActive= false;
            }
            await item.save();
        }

        if(itemDetails.length !== items.length){
            return res.status(200).json({success: false, message: "Some items in Cart were invalid. Other orders are placed!"});
        }

        return res.status(200).json({ success: true, message: "Order placed successfully"});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
};

export const pendingOrders= async(req,res)=> {
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

        const pending_orders= await Order.find({BuyerID: decoded.id, isActive: true}).populate({path: "ItemID",select: "Name"}).populate({path: "SellerID", select: "First_Name Last_Name"});
        if(!pending_orders || pending_orders.length===0){
            return res.status(200).json({success: false, message: "No pending orders"});
        }
        const orderDetails = pending_orders.map((order) => ({
            _id: order._id,
            ItemName: order.ItemID?.Name || "N/A",
            ItemID: order.ItemID?._id,
            SellerFirstName: order.SellerID?.First_Name || "Unknown",
            SellerLastName: order.SellerID?.Last_Name || "Unknown",
            Amount: order.Amount,
        }));
        return res.status(200).json({ success: true, message: "Pending Order fetched successfully", data: orderDetails});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
}

export const updateOrder= async(req,res)=> {
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
        const order=req.body;
        if(!order){
            return res.status(400).json({success: false, message: "No details given"});
        }
        const _id=req.params.id;
        const neworder= await Order.findByIdAndUpdate(_id,order,{new: true});
        if(!neworder){
            return res.status(404).json({success: false, message: " Order not found"});
        }
        return res.status(200).json({ success: true, message: "Order details updated successfully", data: neworder});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
}

export const boughtOrders= async(req,res)=> {
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

        const pending_orders= await Order.find({BuyerID: decoded.id, isActive: false}).populate({path: "ItemID",select: "Name"}).populate({path: "SellerID", select: "First_Name Last_Name"});
        if(!pending_orders || pending_orders.length===0){
            return res.status(200).json({success: false, message: "No pending orders"});
        }
        const orderDetails = pending_orders.map((order) => ({
            _id: order._id,
            ItemID: order.ItemID?._id,
            ItemName: order.ItemID?.Name || "N/A",
            SellerFirstName: order.SellerID?.First_Name || "Unknown",
            SellerLastName: order.SellerID?.Last_Name || "Unknown",
            SellerID: order.SellerID?._id,
            Amount: order.Amount,
        }));
        return res.status(200).json({ success: true, message: "Pending Order fetched successfully", data: orderDetails});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
};

export const soldOrders= async(req,res)=> {
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

        const pending_orders= await Order.find({SellerID: decoded.id, isActive: false}).populate({path: "ItemID",select: "Name"}).populate({path: "BuyerID", select: "First_Name Last_Name"});
        if(!pending_orders || pending_orders.length===0){
            return res.status(200).json({success: false, message: "No pending orders"});
        }
        const orderDetails = pending_orders.map((order) => ({
            _id: order._id,
            ItemName: order.ItemID?.Name || "N/A",
            BuyerFirstName: order.BuyerID?.First_Name || "Unknown",
            BuyerLastName: order.BuyerID?.Last_Name || "Unknown",
            Amount: order.Amount,
        }));
        return res.status(200).json({ success: true, message: "Pending Order fetched successfully", data: orderDetails});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
};

export const deliverOrders= async(req,res)=> {
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

        const pending_orders= await Order.find({SellerID: decoded.id, isActive: true}).populate({path: "ItemID",select: "Name"}).populate({path: "BuyerID", select: "First_Name Last_Name"});
        if(!pending_orders || pending_orders.length===0){
            return res.status(200).json({success: false, message: "No pending orders"});
        }
        const orderDetails = pending_orders.map((order) => ({
            _id: order._id,
            ItemName: order.ItemID?.Name || "N/A",
            BuyerFirstName: order.BuyerID?.First_Name || "Unknown",
            BuyerLastName: order.BuyerID?.Last_Name || "Unknown",
            Amount: order.Amount,
        }));
        return res.status(200).json({ success: true, message: "Pending Order fetched successfully", data: orderDetails});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
};

export const checkotp= async(req,res)=> {
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
        console.log(req.body);
        const id=req.body.id;
        const otp=req.body.OTP;
        if(!id || !otp){
            return res.status(400).json({ success: false, message: "Order ID and OTP are required" });
        }
        const order= await Order.findById(id);
        if(!order){
            console.log("sad");
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        const check= await bcrypt.compare(otp,order.HashedOTP);
        if(!check){
            return res.status(401).json({success: false, message: "Invalid OTP"});
        }
        return res.status(200).json({ success: true, message: "Valid OTP"});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
}

export const closetrans= async(req,res)=> {
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
        const {id}=req.body;
        if(!id){
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }
        const order= await Order.findById(id);
        if(!order){
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        order.isActive=false;
        await order.save();
        return res.status(200).json({ success: true, message: "Transaction Closed"});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
}