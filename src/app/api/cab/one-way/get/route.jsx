import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";

export async function GET(req) {
    try {
        const collectionRef = collection(firestore, "one-way"); // Replace 'one-way' with your Firestore collection name
        const querySnapshot = await getDocs(collectionRef);

        if (querySnapshot.empty) {
            return new Response("No one-way cabs found", { status: 404 });
        }

        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() }); // Collect each document's data
        });

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}
