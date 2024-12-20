import { useState, useEffect, useCallback } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig"; // Import your Firebase config
import { getCookie } from "cookies-next"; // Import cookies-next to handle cookies
import { toast } from "react-toastify";

const useAgentData = (token) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [data, setData] = useState(null);

    // Helper function to fetch the token from cookies or use the provided token
    const getClientToken = useCallback(() => token || getCookie("token"), [token]);

    // Add agent data
    const addData = async (personData) => {
        const { name, email, phoneNumber, password, verifyPassword, agentCode, address } = personData;
        const clientToken = getClientToken();
        if (!clientToken) {
            console.error("Token is missing");
            setError("Token is missing");
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            // Step 1: Create agent in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 2: Add the user’s UID and other data to Firebase Realtime Database
            const agentRef = ref(database, "users/" + user.uid);
            await set(agentRef, {
                name,
                email,
                phoneNumber,
                password,
                verifyPassword,
                agentCode,
                uid: user.uid,
                isAgent: true,
                address,
            });

            setResponse({ message: "Agent created and data saved successfully", agentId: user.uid });
        } catch (err) {
            console.error("Error adding agent data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch agent data
    const viewData = useCallback(async (url) => {
        const clientToken = getClientToken();
        if (!clientToken) {
            console.error("Token is missing.");
            setError("Token is missing.");
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch(`/api/${url}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${clientToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const resultData = await response.json();
            setData(resultData);
        } catch (err) {
            console.error("Error fetching agent data:", err);
            setError(err.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    }, [getClientToken]);

    // Edit agent data
    const editData = async (url, uid, dataToUpdate) => {
        const clientToken = getClientToken();
        if (!clientToken) {
            console.error("Token is missing.");
            setError("Token is missing.");
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const response = await fetch(`/api/${url}/${uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${clientToken}`,
                },
                body: JSON.stringify(dataToUpdate),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("API response for Bad Request:", errorResponse);
                throw new Error(errorResponse.message || `Failed to update: ${response.statusText}`);
            }

            const updatedPerson = await response.json();
            setResponse(updatedPerson);
            return updatedPerson;
        } catch (err) {
            console.error("Error updating agent data:", err.message);
            setError(err.message || "Failed to update agent data.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete agent data
    const deleteData = useCallback(async (url) => {
        const clientToken = getClientToken();
        if (!clientToken) {
            console.error("Token is missing.");
            setError("Token is missing.");
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const response = await fetch(`/api/${url}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("Failed to delete agent.");
            }

            const result = await response.json();
            setResponse(result);
            toast.success(result.message || "Agent deleted successfully.");
        } catch (err) {
            console.error("Error deleting agent:", err);
            setError(err.message || "Failed to delete agent.");
            toast.error(err.message || "Failed to delete agent.");
        } finally {
            setLoading(false);
        }
    }, [getClientToken]);

    return {
        addData,
        viewData,
        editData,
        deleteData,
        loading,
        error,
        response,
        data,
    };
};

export default useAgentData;
