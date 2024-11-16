import { firestore } from "@/firebase/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = params;

    try {
        const tourRef = doc(firestore, "tours", id);
        const tourDoc = await getDoc(tourRef);

        if (!tourDoc.exists()) {
            return NextResponse.json({ message: "Tour not found" }, { status: 404 });
        }

        // Return the tour data
        return NextResponse.json(tourDoc.data(), { status: 200 });
    } catch (error) {
        console.error("Error fetching tour:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        const tourRef = doc(firestore, "tours", id);
        await deleteDoc(tourRef);

        // Successfully deleted
        return NextResponse.json({ message: "Tour deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting tour:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}