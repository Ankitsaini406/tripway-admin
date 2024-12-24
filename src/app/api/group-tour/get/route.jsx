import { ref, get } from "firebase/database";
import { database, firestore } from "@/firebase/firebaseConfig";
import { NextResponse } from "next/server";
import { getDocs, collection, query } from "firebase/firestore";

export async function GET() {

    try {
        const tourCollectionRef = collection(firestore, "group-tours");

        const tourQuery = query(tourCollectionRef, orderBy("date", "desc"));
        const querySnapShot = await getDocs(tourQuery);

        const tours = querySnapShot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(tours, { status: 200 });
    } catch (error) {
        console.error("Error fetching tours: ", error);
        return NextResponse.json({ error: "Error fetching tours" }, { status: 500 });
    }
}
