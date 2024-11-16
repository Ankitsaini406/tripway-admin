import { useState, useEffect, useCallback } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next"; // Import cookies-next

function useAuth() {
    const [token, setToken] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Get the token from cookies on initial load
        const tokenFromCookie = getCookie("token");
        setToken(tokenFromCookie);
    }, []);

    const login = useCallback(async (email, password) => {
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const fetchedToken = await user.getIdToken();
            console.log(fetchedToken);

            setToken(fetchedToken);

            // Set the token in cookies using cookies-next
            setCookie("token", fetchedToken, {
                maxAge: 60 * 60 * 24,  // Token expires in 1 day
                secure: true,  // Only set cookie over HTTPS
                sameSite: "Strict",  // Prevent CSRF attacks
                path: '/',  // Set the cookie across all paths
            });

            router.push("/");

        } catch (err) {
            setError("Error during sign-in: " + err.message);
            console.error("Error during sign-in:", err);
        }
    }, [router]);

    return {
        token,
        error,
        login,
    };
}

export default useAuth;
