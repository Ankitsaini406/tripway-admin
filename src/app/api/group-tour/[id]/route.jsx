import { firestore } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        const tourRef = doc(firestore, "group-tours", id);
        const snapshot = await getDoc(tourRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'Tour not found' }, { status: 404 });
        }

        const tourData = {
            id: snapshot.id,
            ...snapshot.data()
        };

        return NextResponse.json(tourData, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}



export async function PUT(req, { params }) {
    const { id } = params;

    try {
        const tourRef = doc(firestore, "group-tours", id);
        const snapshot = await getDoc(tourRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'Tour not found' }, { status: 404 });
        }
        const requestData = await req.json();

        if (!requestData.name || !requestData.price || !requestData.category || !requestData.description) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await updateDoc(tourRef, {
            name: requestData.name,
            price: requestData.price,
            category: requestData.category,
            description: requestData.description,
            imageUrl: requestData.imageUrl,
        });

        return NextResponse.json({ message: 'Tour updated successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
