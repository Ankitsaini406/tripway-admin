import { firestore } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params; // Assuming the `id` is the Firestore document ID

    try {
        // Reference to the specific document by its ID
        const tourRef = doc(firestore, "group-tours", id); // Use the Firestore document ID

        // Get the document snapshot
        const snapshot = await getDoc(tourRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'Tour not found' }, { status: 404 });
        }

        // Return the document data
        const tourData = {
            id: snapshot.id, // Firestore document ID
            ...snapshot.data() // Document fields
        };

        return NextResponse.json(tourData, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
