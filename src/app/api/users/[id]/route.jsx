import { ref, get, remove, update } from "firebase/database";
import { database, auth } from "@/firebase/firebaseConfig";

export async function GET(req, { params }) {
    const { id } = params;  // Extract `id` from the URL parameters

    try {
        const agentRef = ref(database, 'users/' + id);
        const snapshot = await get(agentRef);

        if (!snapshot.exists()) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(snapshot.val()), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const data = await req.json(); // Parse incoming JSON data

    if (!data.phoneNumber || !data.email) {
        return new Response(
            JSON.stringify({ message: 'Name, phoneNumber, and email are required' }),
            { status: 400 }
        );
    }

    try {
        const agentRef = ref(database, 'users/' + id);
        await update(agentRef, data);

        const updatedUser = await auth.updateUser(id, {
            displayName: data.name,
            email: data.email,
        });

        return new Response(
            JSON.stringify({ message: 'User updated successfully', updatedUser }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: error.message }),
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        const agentRef = ref(database, 'users/' + id);
        const snapshot = await get(agentRef);

        if (!snapshot.exists()) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        const agent = snapshot.val();
        const uid = agent.uid;

        await remove(agentRef);
        await auth.deleteUser(uid);

        return new Response(
            JSON.stringify({ message: 'User deleted successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: error.message }),
            { status: 500 }
        );
    }
}
