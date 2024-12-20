import { ref, get } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";

export async function GET(req) {
    try {
        const userRef = ref(database, "users");
        const snapshot = await get(userRef);

        const allData = snapshot.val();
        const filteredData = Object.keys(allData)
            .filter((key) => !allData[key].isAgent)
            .reduce((result, key) => {
                result[key] = allData[key];
                return result;
            }, {});

        if (Object.keys(filteredData).length === 0) {
            return NextResponse.json(
                { message: "No users found with isAgent set to true" },
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(filteredData), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}
