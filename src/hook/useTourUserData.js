import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { firestore } from "@/firebase/firebaseConfig"; // Firestore config import
import { collection, getDocs } from "firebase/firestore";

const useTourUserData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userTours, setUserTours] = useState(null);

    useEffect(() => {
        const fetchUserTours = async () => {
            const token = getCookie("token"); // Retrieve the token
            if (!token) {
                console.error("Token not found.");
                setError("User is not authenticated.");
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Firestore query
                const toursRef = collection(firestore, "user-tours");
                const querySnapshot = await getDocs(toursRef);

                if (!querySnapshot.empty) {
                    const tours = [];
                    querySnapshot.forEach((doc) => {
                        tours.push({ id: doc.id, ...doc.data() });
                    });
                    setUserTours(tours);
                } else {
                    console.warn("No tours found for the user.");
                    setUserTours([]);
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching user tours:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserTours();
    }, []);

    return { loading, error, userTours };
};

export default useTourUserData;
