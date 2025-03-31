import express from "express";
import { deleteItem, getItems, createItem, updateItem } from "../controllers/item.controller.js";

const item_router= express.Router();

item_router.get("/", getItems);               // all items page
item_router.post("/create", createItem);      // create item page
item_router.patch("/update/:id", updateItem);   // update item page
item_router.delete("/delete/:id", deleteItem);            // delete item page

export default item_router;