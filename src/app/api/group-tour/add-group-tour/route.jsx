import { firestore } from "@/firebase/firebaseConfig"; // Ensure the correct db import
import { collection, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the request body
        const { name, price, category, description, imageUrl } = await req.json();

        // Get reference to the Firestore collection 'tours'
        const tourRef = collection(firestore, "group-tours");

        // Prepare tour data
        const tourData = {
            name,
            price,
            category,
            description,
            imageUrl,
        };

        // Add the tour data to Firestore
        await addDoc(tourRef, tourData);

        return new NextResponse(JSON.stringify({ message: "Tour created successfully!" }), {
            status: 201,
        });
    } catch (error) {
        console.error("Error creating tour:", error);
        return new NextResponse(JSON.stringify({ message: error.message }), {
            status: 500,
        });
    }
}
