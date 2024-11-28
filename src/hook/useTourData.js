import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

const useTourData = (token) => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchTours = async (url) => {
        setLoading(true);
        setTours(null);
        setError(null);
        try {
            const storedToken = token || getCookie("token");
            if (!storedToken) {
                throw new Error("Token is missing.");
            }

            const response = await fetch(`/api/${url}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch tours.");
            }

            const data = await response.json();
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
        try {
            const storedToken = token || getCookie("token");
            if (!storedToken) {
                throw new Error("Token is missing.");
            }

            const response = await fetch(`http://localhost:3000/api/${url}/${tourId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete tour.");
            }

            setTours((prevTours) => prevTours.filter((tour) => tour.id !== tourId));
            setSuccess("Tour deleted successfully.");
        } catch (err) {
            setError(err.message);
            console.error("Error deleting tour:", err);
        } finally {
            setLoading(false);
        }
    };

    const createTour = async (url, tourData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const storedToken = token || getCookie("token");
            if (!storedToken) {
                throw new Error("Token is missing.");
            }

            const tourDataToSave = {
                name: tourData.name,
                price: tourData.price,
                category: tourData.category,
                description: tourData.description,
                imageUrl: tourData.imageUrl,
            };

            const response = await fetch(`http://localhost:3000/api/${url}`, {
                method: "POST",
                body: JSON.stringify(tourDataToSave),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to create tour.");
            }

            const newTour = await response.json();
            setTours((prevTours) => [...prevTours, newTour]);
            setSuccess("Tour created successfully.");
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
            const storedToken = token || getCookie("token");
            if (!storedToken) {
                throw new Error("Token is missing.");
            }

            const response = await fetch(`http://localhost:3000/api/${url}/${tourId}`, {
                method: "PUT",
                body: JSON.stringify(updatedData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to update tour.");
            }

            const updatedTour = await response.json();
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
