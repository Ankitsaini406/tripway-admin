import { ref, get } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const agentRef = ref(database, 'agents');
        const snapshot = await get(agentRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'No agents found' }, { status: 404 });
        }

        return NextResponse.json(snapshot.val(), { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
