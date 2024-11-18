import { ref, get } from "firebase/database";
import { database, firestore } from "@/firebase/firebaseConfig";
import { NextResponse } from "next/server";
import { getDocs, collection } from "firebase/firestore";

export async function GET() {

    try {
        const tourCollectionRef = collection(firestore, "group-tours");
        const querySnapShot = await getDocs(tourCollectionRef);

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

// export async function GET() {
//     try {
//         const tourRef = ref(database, 'tours');
//         const snapshot = await get(tourRef);

//         if (!snapshot.exists()) {
//             return NextResponse.json({ message: 'No tours found' }, { status: 404 });
//         }

//         return NextResponse.json(snapshot.val(), { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ message: error.message }, { status: 500 });
//     }
// }
