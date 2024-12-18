import { useState } from "react";
import { getCookie } from "cookies-next";

const useTourData = (token) => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

    const getToken = () => {
        const storedToken = token || getCookie("token");
        if (!storedToken) throw new Error("Token is missing.");
        return storedToken;
    };

    const handleResponse = async (response) => {
        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error: ${response.status} - ${message}`);
        }
        return response.json();
    };

    const fetchTours = async (url) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const storedToken = getToken();
            const response = await fetch(`${API_BASE_URL}/${url}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await handleResponse(response);
            setTours(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching tours:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteTour = async (url, tourId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const storedToken = getToken();
            const response = await fetch(`${API_BASE_URL}/${url}/${tourId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });
            await handleResponse(response);
            setTours((prevTours) => prevTours.filter((tour) => tour.id !== tourId));
            setSuccess("Tour deleted successfully.");
        } catch (err) {
            setError(err.message);
            console.error("Error deleting tour:", err);
        } finally {
            setLoading(false);
        }
    };

    const createTour = async (url, tourData, file) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            const storedToken = getToken();
    
            // Create FormData
            const formData = new FormData();
            formData.append("file", file); // Append the file
            formData.append("metadata", JSON.stringify(tourData)); // Append metadata as JSON
    
            // Debugging: Log FormData content
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
    
            const response = await fetch(`${API_BASE_URL}/${url}`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
    
            const responseData = await handleResponse(response);
            setTours((prevTours) => [...prevTours, responseData]);
            setSuccess("Tour created successfully!");
        } catch (err) {
            setError(err.message);
            console.error("Error creating tour:", err);
        } finally {
            setLoading(false);
        }
    };

    const editTour = async (url, tourId, updatedData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const storedToken = getToken();
            const response = await fetch(`${API_BASE_URL}/${url}/${tourId}`, {
                method: "PUT",
                body: JSON.stringify(updatedData),
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });
            const updatedTour = await handleResponse(response);
            setTours((prevTours) =>
                prevTours.map((tour) => (tour.id === tourId ? updatedTour : tour))
            );
            setSuccess("Tour updated successfully.");
        } catch (err) {
            setError(err.message);
            console.error("Error updating tour:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        tours,
        loading,
        error,
        success,
        fetchTours,
        deleteTour,
        createTour,
        editTour,
    };
};

export default useTourData;
