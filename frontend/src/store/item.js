import {create} from "zustand";

export const useItemStore= create((set)=> ({
    items: [],
    
    setItems: (items)=> set({items}),

    createItem: async(newItem)=> {
        if(!newItem.Name || !newItem.Price || !newItem.Description || !newItem.Category || !newItem.Stock){
            return { success: false, message: "Please fill in all necessary fields."}
        }

        const token =localStorage.getItem("token");
        if(!token){
            return { success: false, message: "No token found"} ;
        }

        const res= await fetch("http://localhost:5000/api/items/create", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify(newItem)
        })
        const data= await res.json();
        if(res.ok){
            set((state)=> ({items: [...state.items, data.data]}));
        }
        return { success: data.success, message: data.message};
    },

    updateItem: async({Name,Price,Description,Category,Stock,id})=> {
        if(Name=="" && Price=="" && Description=="" && Category=="" && Stock==""){
            return { success: false, message: "Please fill any of the fields."}
        }
        if(!id){
            return {success: false, message: "No item id given"};
        }

        const token =localStorage.getItem("token");
        if(!token){
            return { success: false, message: "No token found"} ;
        }

        const jsonbody= {};
        if(Name!=""){
            jsonbody.Name= Name;
        }
        if(Price!=""){
            jsonbody.Price= Price;
        }
        if(Description!=""){
            jsonbody.Description= Description;
        }
        if(Category!=""){
            jsonbody.Category= Category;
        }
        if(Stock!=""){
            jsonbody.Stock= Stock;
        }

        const res= await fetch(`http://localhost:5000/api/items/update/${id}`, {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(jsonbody),
        })
        const data= await res.json();
        if(data.success){
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            return { success: data.success, message: data.message};
        }
    },

    deleteItem: async(id)=> {
        if(!id){
            return {success: false, message: "id not given"};
        }
        const token =localStorage.getItem("token");
        if(!token){
            return { success: false, message: "No token found"} ;
        }

        const res= await fetch(`http://localhost:5000/api/items/delete/${id}`, {
            method: "DELETE",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        const data= await res.json();
        if(data.success){
            return {success: data.success, message: data.message};
        }
        else{
            return { success: data.success, message: data.message};
        }
    },

    fetchItems: async({categories, searchName, itemId, sellerId})=> {

        var query_send="";

        if(categories){
            query_send+=`categories=${categories}&`;
        }
        if(searchName){
            query_send+=`name=${searchName}&`;
        }
        if(itemId){
            query_send+=`id=${itemId}&`;
        }
        if(sellerId){
            query_send+=`sellerId=${sellerId}&`;
        }
        
        const token =localStorage.getItem("token");
        if(!token){
            return { success: false, message: "No token found"} ;
        }
        //console.log(query_send);
        set({items:[]});
        const res= await fetch(`http://localhost:5000/api/items?${query_send}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        const data= await res.json();
        console.log(data);
        if(data.success){
            set({items: data.data});
            return { success: true, message: data.message, data: data.data};
        }
        else{
            set({items:[]});
            return { success: false, message: data.message, data: {success: false}};
        }
    },

}))