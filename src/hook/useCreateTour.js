import { useState } from "react";

const useCreateTour = (url, token) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const createTour = async (tourData) => {
        setIsUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const tourDataToSave = {
                name: tourData.name,
                price: tourData.price,
                category: tourData.category,
                description: tourData.description,
                imageUrl: tourData.imageUrl,
            };

            const response = await fetch(`http://localhost:3000/api/${url}`, {
                method: 'POST',
                body: JSON.stringify(tourDataToSave),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setSuccess("Tour created successfully!");
            } else {
                throw new Error("Failed to create tour.");
            }
        } catch (err) {
            setError(err.message);
            console.error("Error creating tour:", err);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        createTour,
        isUploading,
        error,
        success,
    };
};

export default useCreateTour;
