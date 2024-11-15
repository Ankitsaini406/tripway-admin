// src/app/api/agents/[id]/route.js

import { ref, get, remove, update } from "firebase/database";
import { database, auth } from "@/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

// GET handler to fetch an agent by ID
export async function GET(req, { params }) {
    const { id } = params;  // Extract `id` from the URL parameters

    try {
        const agentRef = ref(database, `agents/${id}`);
        const snapshot = await get(agentRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
        }

        return NextResponse.json(snapshot.val(), { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PUT handler to update an agent by ID
export async function PUT(req, { params }) {
    const { id } = params;
    let data;

    try {
        data = await req.json(); // Parse incoming JSON data
    } catch (err) {
        return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    // Validate required fields
    if (!data.phoneNumber || !data.email) {
        return NextResponse.json(
            { message: 'phoneNumber and email are required' },
            { status: 400 }
        );
    }

    try {
        const agentRef = ref(database, `agents/${id}`);
        await update(agentRef, data);

        // Assuming `auth` is the Firebase Admin Auth SDK
        const updatedUser = await auth.updateUser(id, {
            displayName: data.name,
            email: data.email,
        });

        return NextResponse.json(
            { message: 'Agent updated successfully', updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

// DELETE handler to delete an agent by ID
export async function DELETE(req, context) {
    const { id } = await context.params; // Await the context.params

    try {
        // Reference the specific agent in Firebase Realtime Database
        const agentRef = ref(database, `agents/${id}`);
        
        // Check if the agent exists in the database
        const snapshot = await get(agentRef);
        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
        }

        // Retrieve the agent's UID from the database
        const agent = snapshot.val();
        const uid = agent.uid;

        // Delete the agent data from Realtime Database
        await remove(agentRef);

        // Delete the agent from Firebase Authentication
        await auth.deleteUser(uid);

        // Send a success response
        return NextResponse.json({ message: 'Agent deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error deleting agent:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}