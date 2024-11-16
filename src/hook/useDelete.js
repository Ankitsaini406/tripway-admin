import { useState, useCallback } from "react";
import { toast } from "react-toastify";

function useDeleteAgent() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const deleteData = useCallback(async (url) => {
        setIsDeleting(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch(`/api/${url}`, { method: 'DELETE' });

            if (!res.ok) {
                throw new Error("Failed to delete agent.");
            }

            const data = await res.json();
            setResponse(data);
            toast.success(data);
        } catch (err) {
            console.error("Error deleting agent:", err);
            setError(err.message);
            toast.error(err);
        } finally {
            setIsDeleting(false);
        }
    }, []);

    return { deleteData, isDeleting, response, error };
}

export default useDeleteAgent;
