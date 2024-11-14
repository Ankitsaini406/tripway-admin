// src/app/api/agents/[id]/route.js

import { ref, get, remove, update } from "firebase/database";
import { database, auth } from "@/firebase/firebaseConfig";
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
export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        const agentRef = ref(database, `agents/${id}`);
        const snapshot = await get(agentRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
        }

        const agent = snapshot.val();
        const uid = agent.uid;

        await remove(agentRef);
        await auth.deleteUser(uid); // Assuming `auth` is the Firebase Admin Auth SDK

        return NextResponse.json(
            { message: 'Agent deleted successfully' },
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
