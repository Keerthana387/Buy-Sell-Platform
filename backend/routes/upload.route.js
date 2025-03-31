import express from "express";
import { uploadImage, uploadcontroller } from "../controllers/upload.controller.js";

const upload_router= express.Router();

upload_router.post("/", uploadImage.single('image'), uploadcontroller );   

export default upload_router;