import { firestore } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, context) {

    const { id } = await context.params;

    try {
        const tourRef = doc(firestore, "group-tours", id);
        const snapshot = await getDoc(tourRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ message: "Tour not found" }, { status: 404 });
        }
        const tourData = {
            id: snapshot.id,
            ...snapshot.data(),
        };

        return NextResponse.json(tourData, { status: 200 });
    } catch (error) {
        console.error("Error fetching tour:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req, context) {

    const { id } = await context.params;

    try {
        const tourRef = doc(firestore, "group-tours", id);
        const snapshot = await getDoc(tourRef);
        if (!snapshot.exists()) {
            return NextResponse.json({ message: "Tour not found" }, { status: 404 });
        }

        const requestData = await req.json();

        if (!requestData.name || !requestData.price || !requestData.category || !requestData.description) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await updateDoc(tourRef, {
            name: requestData.name,
            slug: requestData.slug,
            price: requestData.price,
            category: requestData.category,
            pickuppoints: requestData.pickuppoints,
            description: requestData.description,
            imageUrl: requestData.imageUrl,
            exclusions: requestData.exclusions,
            inclusions: requestData.inclusions,
            itinerary: requestData.itinerary,
        });

        return NextResponse.json({ message: "Tour updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating tour:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, context) {

    const { id } = await context.params;

    try {
        const tourRef = doc(firestore, "group-tours", id);
        const snapshot = await getDoc(tourRef);
        if (!snapshot.exists()) {
            return NextResponse.json({ message: "Tour not found" }, { status: 404 });
        }
        await deleteDoc(tourRef);

        return NextResponse.json({ message: "Tour deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting tour:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
