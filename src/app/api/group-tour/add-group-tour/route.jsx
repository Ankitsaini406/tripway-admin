import { firestore } from "@/firebase/firebaseConfig"; // Ensure the correct db import
import { collection, addDoc, snapshotEqual } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the request body
        const { name, price, category, description, imageUrl, startDate, exclusions, inclusions, itinerary } = await req.json();

        const sanitizedItinerary = Array.isArray(itinerary)
            ? itinerary.map((item) => ({
                title: item.title || "Untitled",
                description: item.description || "No description provided",
                activities: Array.isArray(item.activities) ? item.activities.filter(Boolean) : [],
            }))
            : [];

        const tourData = {
            name,
            price,
            category,
            description,
            imageUrl,
            startDate,
            exclusions,
            inclusions,
            itinerary: sanitizedItinerary,
        };
        
        const tourRef = collection(firestore, "group-tours");
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
