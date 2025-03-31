import {create} from "zustand";

export const useUserStore= create((set)=> ({
    users: [],
    items: [],

    setUsers: (users)=> set({users}),
    
    createUser: async(newUser)=> {
        if(!newUser.First_Name || !newUser.Last_Name || !newUser.Email || !newUser.Age || !newUser.Contact_Number || !newUser.Password){
            return { success: false, message: "Please fill in all necessary fields."}
        }
        const res= await fetch("http://localhost:5000/api/users/create", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(newUser)
        })
        const data= await res.json();
        if(res.ok){
            set((state)=> ({users: [...state.users, data.data]}));
            localStorage.setItem("token",data.token);
        }
        return { success: data.success, message: data.message};
    },

    logincheck: async({Email,Password})=> {
        if(!Email || !Password){
            return {success: false, message: "Please provide email and password."};
        }
        try{
            const res= await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({Email, Password}),
            });

            const data= await res.json();
            if(data.success){
                localStorage.setItem("token", data.token);
                const token =localStorage.getItem("token");
            }
            return {success: data.success, message: data.message};
        } catch(err){
            console.log("Error in login check: ", err.message);
            return {success: false, message: err.message};
        }
    },

    fetchUserInfo: async()=> {

        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }

        const res= await fetch("http://localhost:5000/api/users", {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        const data= await res.json();
        if(data.success){
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            return { success: data.success, message: data.message};
        }
    },

    fetchSellerInfo: async(id)=> {
        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }

        const res= await fetch(`http://localhost:5000/api/users/info/${id}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        const data= await res.json();
        //console.log(data.data);
        if(data.success){
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            return { success: data.success, message: data.message};
        }
    },

    logoutUser: async()=> {

        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }
        try{
            // const res= await fetch("api/users/logout", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`
            //     },
            // });
            // const data= await res.json();
            // console.log({success: data.success, message: data.message});
            localStorage.removeItem("token");
            return {success: true, message: "Logout successful"};
        } catch(err){
            console.log("Error in login check: ", err.message);
            return {success: false, message: err.message};
        }
    },

    updateprofile: async({First_Name,Last_Name,Age,Contact_Number,OldPassword,NewPassword})=> {
        if(First_Name=="" && Last_Name=="" && Age=="" && Contact_Number=="" && OldPassword=="" && NewPassword==""){
            return {success: false, message: "Please fill in any of the fields"};
        }

        const jsonbody= {};
        if(First_Name!=""){
            jsonbody.First_Name= First_Name;
        }
        if(Last_Name!=""){
            jsonbody.Last_Name= Last_Name;
        }
        if(Age!=""){
            jsonbody.Age= Age;
        }
        if(Contact_Number!=""){
            jsonbody.Contact_Number= Contact_Number;
        }

        if(OldPassword!="" && NewPassword!=""){
            jsonbody.OldPassword= OldPassword;
            jsonbody.NewPassword= NewPassword;
        } else if(OldPassword!="" || NewPassword!=""){
            return { success: false, message: "Both Old Password and New Password are required!"};
        }

        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }
        const res= await fetch("http://localhost:5000/api/users/update", {
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

    AddToCart: async(Item)=> {
        if(!Item){
            return {success: false, message: "ItemID no given"};
        }

        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }
        const res= await fetch("http://localhost:5000/api/users/cart/add", {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(Item),
        })
        const data= await res.json();
        if(data.success){
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            return { success: data.success, message: data.message};
        }
    },

    RemoveFromCart: async(ItemID)=> {
        if(!ItemID){
            return {success: false, message: "ItemID no given"};
        }

        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }

        const jsonbody= {};
        jsonbody.ItemID= ItemID;

        const res= await fetch("http://localhost:5000/api/users/cart/remove", {
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

    GetCart: async()=> {
        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }
        const res= await fetch("http://localhost:5000/api/users/cart/get", {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        const data= await res.json();
        if(data.success){
            set({items: data.data});
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            return { success: data.success, message: data.message};
        }
    },

    placeOrder: async()=> {
        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }
        const res= await fetch("http://localhost:5000/api/orders/create", {
            method: "POST",
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
    }

}))