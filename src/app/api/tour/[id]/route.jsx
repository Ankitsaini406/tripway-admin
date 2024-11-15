import { firestore } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
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
