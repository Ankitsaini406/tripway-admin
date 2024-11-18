import { useState } from "react";

const useCreateTour = (url) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const createTour = async (tourData) => {
        setIsUploading(true);
        setError(null);
        setSuccess(null);

        try {
            // Prepare the tour data to be saved in the database (without image)
            const tourDataToSave = {
                name: tourData.name,
                price: tourData.price,
                category: tourData.category,
                description: tourData.description,
                // Do not send image, just save the other details
            };

            // Step 1: Submit the tour data (excluding image) to your backend to save in the database
            const response = await fetch(`http://localhost:3000/api/${url}`, {
                method: 'POST',
                body: JSON.stringify(tourDataToSave),
                headers: {
                    'Content-Type': 'application/json',
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
