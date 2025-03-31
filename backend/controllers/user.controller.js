import mongoose from "mongoose";
import User from "../models/user.model.js";
import Item from "../models/item.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import redis from 'redis';

const redisClient= redis.createClient();
//redisClient.on('error', (err)=> console.log("Redis Client error; ", err.message));

// (async()=> {
// 	try{
// 		if(!redisClient.isOpen){
// 			await redisClient.connect();
// 			console.log("Connected to Redis successfully");
// 		}
// 	} catch(err){
// 		console.log("Error in connecting to Redis: ",err.message);
// 	}
// })();

export const getUsers= async(req,res)=> {
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
        return res.status(200).json({ success: true, data: user, message: "User info fetched successfully"});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
}

export const getUserInfo= async(req,res)=> {
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

		const seller=req.params.id;
        const user= await User.findById(seller).select("-Password");
		if(!user){
			return res.status(404).json({success: false, message: "User not found"});
		}
		//console.log(user);
        return res.status(200).json({ success: true, data: user, message: "User info fetched successfully"});
    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
}

export const createUser= async(req,res)=> {
    const user= req.body; //user will send this data

    //check all conditions
    if (!user.First_Name || !user.Last_Name || !user.Email || !user.Age || !user.Contact_Number || !user.Password) {
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}
	const hashedPassword= await bcrypt.hash(user.Password,10);
	const args={...user, Password:hashedPassword};
    const newUser= new User(args);

    try{
        await newUser.save();
		const access_token= jwt.sign({id: newUser._id}, process.env.ACCESS_TOKEN_SECRET);
        return res.status(201).json({ success: true, data: newUser, message: "User created successfully", token: access_token});

    } catch(err){
        console.error("Error in Create user:", err.message);
		return res.status(500).json({ success: false, message: `${err.message}` });
    }
}

export const updateUser = async(req,res)=> {
	const authHeader= req.headers.authorization;
	const user= req.body;

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

		const currentuser= await User.findById(decoded.id);

		if(user.OldPassword && user.NewPassword){
			if(!currentuser){
				return res.status(404).json({success: false, message: "User not found"});
			}
			
			const check= await bcrypt.compare(user.OldPassword,currentuser.Password);
			if(!check){
				return res.status(401).json({success: false, message: "Incorrect old password"});
			}
			currentuser.Password=user.NewPassword;
		}

		if(user.First_Name){
			currentuser.First_Name=user.First_Name;
		}
		if(user.Last_Name){
			currentuser.Last_Name=user.Last_Name;
		}
		if(user.Age){
			currentuser.Age=user.Age;
		}
		if(user.Contact_Number){
			currentuser.Contact_Number=user.Contact_Number;
		}
	
		try {
			const updatedUser = await User.findByIdAndUpdate(decoded.id, currentuser, { new: true });
			return res.status(200).json({ success: true, data: updatedUser, message: "User data updated successfully" });
		} catch (err) {
			console.error("Error in update user:", err.message);
			return res.status(500).json({ success: false, message: `${err.message}`});
		}

    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
	
};

export const deleteUser= async(req,res)=> {

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
	
		try {
			await User.findByIdAndDelete(decoded.id);
			return res.status(200).json({ success: true, message: "User deleted successfully" });
		} catch (err) {
			console.log("error in deleting User:", err.message);
			return res.status(500).json({ success: false, message: `${err.message}` });
		}

    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }

};

export const loginUser= async(req,res)=> {
	const { Email, Password}=req.body;

	if(!Email || !Password){
		return res.status(400).json({success: false, message: "Please provide both email and password."});
	}

	try{
		const user= await User.findOne({Email});
		if(!user){
			return res.status(404).json({success: false, message: "User not found"});
		}

		const check= await bcrypt.compare(Password,user.Password);
		if(!check){
			return res.status(401).json({success:false, message: "Invalid Email or wrong Password"});
		}

		const access_token= jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET);

        return res.status(201).json({ success: true, data: user, message: "Login successful", token: access_token});

	} catch(err){
		console.log("error in login:", err.message);
		return res.status(500).json({ success: false, message: `${err.message}` });
	}
};

export const logoutUser= async(req,res)=> {
	const authHeader= req.headers.authorization;

	if(!authHeader || !authHeader.startsWith("Bearer ")){
		return res.status(401).json({success: false, message: "No token provides or invalid format"});
	}

	const token= authHeader.split(" ")[1];

	redisClient.set(token, "blacklisted", "EX", 60*60*24, (err)=> {
		if(err){
			return res.status(500).json({success: false, message: "Error in blacklisting token"});
		}
		return res.status(200).json({success: true, message: "Logout successful"});
	});

};

export const AddToCart= async(req,res)=> {
	const authHeader= req.headers.authorization;
	const item= req.body;

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
		
		const itemData = await Item.findById(item._id);
		if (!itemData) {
			return res.status(404).json({ success: false, message: "Item not found" });
		}

		if (!itemData.isActive) {
			return res.status(403).json({ success: false, message: "Item is not active and cannot be added to Cart" });
		}

		try {
			if(decoded.id=== item.SellerID){
				return res.status(403).json({success: false, message:"You cannot add your own item to Cart!"});
			}
			const updatedUser= await User.findByIdAndUpdate(decoded.id,{$push: {Cart: item._id}}, {new: true})
			return res.status(200).json({ success: true, data: updatedUser, message: "Added to Cart successfully" });
		} catch (err) {
			console.log("error in Adding to Cart:", err.message);
			return res.status(500).json({ success: false, message: `${err.message}` });
		}

    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
};

export const RemoveFromCart= async(req,res)=> {
	const authHeader= req.headers.authorization;
	const user= req.body;

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
	
		try {
			const updatedUser= await User.findByIdAndUpdate(decoded.id,{$pull: {Cart: user.ItemID}}, {new: true})
			return res.status(200).json({ success: true, data: updatedUser, message: "Removed from Cart successfully" });
		} catch (err) {
			console.log("error in Removing from Cart:", err.message);
			return res.status(500).json({ success: false, message: `${err.message}` });
		}

    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
}

export const GetCart= async(req,res)=> {
	const authHeader= req.headers.authorization;
	const user= req.body;

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
	
		try {
			const user= await User.findById(decoded.id).select("Cart");
			if(!user){
				return res.status(404).json({success: false, message: "User not found"});
			}

			const items= await Item.find({_id: {$in: user.Cart}});
			return res.status(200).json({ success: true, data: items, message: "Cart items fetched successfully" });
		} catch (err) {
			console.log("error in Adding to Cart:", err.message);
			return res.status(500).json({ success: false, message: `${err.message}` });
		}

    } catch(err){
        console.log("Error in verying token: ", err.message);
        return res.status(500).json({ success: false, message: `${err.message}`});
    }
}
