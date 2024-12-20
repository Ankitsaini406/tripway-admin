
import { ref, get, remove, update } from "firebase/database";
import { database, auth } from "@/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

// GET handler to fetch an agent by ID
export async function GET(req, context) {
    const { id } = await context.params;

    try {
        const agentRef = ref(database, `users/${id}`);
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
export async function PUT(req, context) {
    const { id } = await context.params;
    let data;

    try {
        data = await req.json();
    } catch (err) {
        return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    try {
        const agentRef = ref(database, `users/${id}`);
        await update(agentRef, data);

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
    const { id } = await context.params;

    try {
        const agentRef = ref(database, `users/${id}`);
        
        const snapshot = await get(agentRef);
        if (!snapshot.exists()) {
            return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
        }
        const agent = snapshot.val();
        const uid = agent.uid;

        await remove(agentRef);
        await auth.deleteUser(uid);

        return NextResponse.json({ message: 'Agent deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error deleting agent:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}