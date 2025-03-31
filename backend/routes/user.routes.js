import express from "express";
import { createUser, deleteUser, getUsers, updateUser, loginUser, logoutUser, getUserInfo, AddToCart, RemoveFromCart, GetCart} from "../controllers/user.controller.js";

const user_router= express.Router();

user_router.get("/", getUsers);               // users page
user_router.get("/info/:id",getUserInfo);         //user info with id
user_router.post("/create", createUser);      // create user page
user_router.patch("/update", updateUser);   // update user page
user_router.delete("/delete/:id", deleteUser);            // delete user page
user_router.patch("/cart/add",AddToCart);         //adds item to cart
user_router.patch("/cart/remove", RemoveFromCart); //removes item from cart
user_router.get("/cart/get", GetCart);         //give cart items
user_router.post("/login", loginUser);              //login
user_router.post("/logout",logoutUser);            //logout

export default user_router;