import {create} from "zustand";

export const useOrderStore= create((set)=>({
    orders: [],
    boughtorders: [],
    soldorders: [],
    deliverorders: [],

    setOrders: (orders)=> set({orders}),
    setboughtOrders: (boughtorders)=> set({boughtorders}),
    setsoldOrders: (soldorders)=> set({soldorders}),
    setdeliverorders: (deliverorders)=> set({deliverorders}),

    getPendingOrders: async()=> {
        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }

        const res= await fetch("http://localhost:5000/api/orders/pending", {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        const data= await res.json();
        if(data.success){
            set({orders: data.data});
            console.log(data.data);
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            set({orders: []});
            return { success: data.success, message: data.message};
        }
    },

    getboughtOrders: async()=> {
        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }

        set({boughtorders: []});
        const res= await fetch(`http://localhost:5000/api/orders/bought`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        const data= await res.json();
        console.log(data);
        if(data.success){
            set({boughtorders: data.data});
            console.log(data.data);
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            set({boughtorders: []});
            return { success: data.success, message: data.message};
        }
    },

    getsoldOrders: async()=> {
        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }

        set({soldorders: []});
        const res= await fetch(`http://localhost:5000/api/orders/sold`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })

        const data= await res.json();
        console.log(data);
        if(data.success){
            set({soldorders: data.data});
            console.log(data.data);
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            set({soldorders: []});
            return { success: data.success, message: data.message};
        }
    },

    getdeliverorders: async()=> {
        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }
        set({deliverorders: []});
        const res= await fetch(`http://localhost:5000/api/orders/deliver`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })

        const data= await res.json();
        console.log(data);
        if(data.success){
            set({deliverorders: data.data});
            console.log(data.data);
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            set({deliverorders: []});
            return { success: data.success, message: data.message};
        }
    },

    updateOTP: async({_id,hashedOTP})=> {
        if(!_id || !hashedOTP){
            return {success: false, message: "Give both order id and OTP"};
        }

        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }
        const jsonbody= {};
        jsonbody.HashedOTP=hashedOTP;
        const res= await fetch(`http://localhost:5000/api/orders/update/${_id}`, {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(jsonbody),
        })
        const data= await res.json();
        if(data.success){
            console.log(data.data);
            return {success: data.success, message: data.message, data: data.data};
        }
        else{
            return { success: data.success, message: data.message};
        }
    },

    checkOTP: async({otp,id})=> {
        if(!otp || !id){
            return {success: false, message: "Give both OTP and Order ID"};
        }

        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }

        const jsonbody= {};
        jsonbody.OTP=otp;
        jsonbody.id=id;
        console.log(jsonbody);
        const res= await fetch(`http://localhost:5000/api/orders/otpcheck`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(jsonbody),
        })

        const data= await res.json();
        if(data.success){
            console.log(data);
            return {success: data.success, message: data.message};
        }
        else{
            return { success: data.success, message: data.message};
        }
    },

    closetrans: async(id)=> {
        if(!id){
            return {success: false, message: "Give OTP"};
        }

        const token =localStorage.getItem("token");
        if(!token){
           return { success: false, message: "No token found"} ;
        }

        const jsonbody= {};
        jsonbody.id=id;

        const res= await fetch(`http://localhost:5000/api/orders/close`, {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(jsonbody),
        })

        const data= await res.json();
        if(data.success){
            console.log(data);
            return {success: data.success, message: data.message};
        }
        else{
            return { success: data.success, message: data.message};
        }
    }

}))