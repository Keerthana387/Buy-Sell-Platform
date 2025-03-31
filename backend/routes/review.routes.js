import express from "express";
import { createReview, updateReview, deleteReview, getReviews } from "../controllers/review.controller.js";

const review_router= express.Router();

review_router.post("/create", createReview);      // create review page
review_router.patch("/update/:id", updateReview);   // update review page
review_router.delete("/delete/:id", deleteReview);            // delete review page
review_router.get("/get",getReviews);  

export default review_router;