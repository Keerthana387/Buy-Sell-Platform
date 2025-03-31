import { create } from "zustand";

export const useReviewStore = create((set) => ({
    reviews: [],

    setreviews: (reviews) => set({ reviews }),

    createreview: async (newItem) => {
        if (!newItem.SellerID || !newItem.rating || !newItem.comment) {
            return { success: false, message: "Please fill in all necessary fields." }
        }

        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, message: "No token found" };
        }

        const res = await fetch("http://localhost:5000/api/reviews/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newItem)
        })
        const data = await res.json();
        console.log(data);
        if (res.ok) {
            set((state) => ({ reviews: [...state.reviews, data.data] }));
        }
        return { success: data.success, message: data.message };
    },

    getreviews: async () => {
        set({ reviews: [] });
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, message: "No token found" };
        }

        const res = await fetch("http://localhost:5000/api/reviews/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        const data = await res.json();
        console.log(data);
        if (res.ok) {
            set({ reviews: data.data });
        }
        return { success: data.success, message: data.message };
    }
}))