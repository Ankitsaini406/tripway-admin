import { ref, get } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const agentRef = ref(database, 'users');
        const snapshot = await get(agentRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'No agents found' }, { status: 404 });
        }

        // Filter data where isAgent is true
        const allData = snapshot.val();
        const filteredData = Object.keys(allData)
            .filter((key) => allData[key].isAgent) // Check if isAgent is true
            .reduce((result, key) => {
                result[key] = allData[key];
                return result;
            }, {});

        if (Object.keys(filteredData).length === 0) {
            return NextResponse.json({ message: 'No agents found with isAgent set to true' }, { status: 404 });
        }

        return NextResponse.json(filteredData, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
