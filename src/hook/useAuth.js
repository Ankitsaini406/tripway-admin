import { useState, useContext, useCallback, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

function useAuth() {
    const [token, setToken] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
            setToken(localStorage.getItem("token"));
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
                localStorage.setItem("token", fetchedToken);
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
