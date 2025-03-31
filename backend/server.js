import express from 'express';
import mongoose, { connect } from 'mongoose';
import user_router from './routes/user.routes.js';
import item_router from './routes/item.routes.js';
import order_router from './routes/order.routes.js';
import review_router from './routes/review.routes.js';
import upload_router from './routes/upload.route.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


const PORT= 5000;

const app= express();

app.use(cors());

//middleware
app.use(express.json()); // allows us to accept JSON data

//connect to mongoDB

try {
    const conn= await mongoose.connect(process.env.MONGO_URI);
    // const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    app.listen(PORT, ()=> {
        console.log(`Server sarted at http://localhost:${process.env.PORT}`);
        // console.log(`Server started at http://localhost:${PORT} `);
    })
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);  // process code 1 code means exit with failure, 0 means success
}

app.get("/", (req,res)=> {
    res.send("Server is ready");
})

app.use("/api/users", user_router);
app.use("/api/items", item_router);
app.use("/api/orders", order_router);
app.use("/api/reviews", review_router);
app.use("/api/uploads", upload_router);
app.use('/uploads', express.static('uploads'));

//StQ5uFrejZcB4TqR
