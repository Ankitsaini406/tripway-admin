import { useState, useCallback } from "react";

function useDeleteAgent() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const deleteAgent = useCallback(async (id) => {
        setIsDeleting(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch(`/api/agents/${id}`, { method: 'DELETE' });

            if (!res.ok) {
                throw new Error("Failed to delete agent.");
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            console.error("Error deleting agent:", err);
            setError(err.message);
        } finally {
            setIsDeleting(false);
        }
    }, []);

    return { deleteAgent, isDeleting, response, error };
}

export default useDeleteAgent;
