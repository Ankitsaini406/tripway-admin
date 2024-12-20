import { ref, set } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the request body
        const { uid, name, email, phoneNumber, password, verifyPassword, address, isAgent } = await req.json();

        // Create a reference in the Firebase Realtime Database for the agent
        const agentRef = ref(database, 'users/' + uid);
        await set(agentRef, { name, email, phoneNumber, password, verifyPassword, uid, isAgent, address });

        // Respond with success status and message
        return NextResponse.json({ message: 'Agent record saved successfully', agentId: uid }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
