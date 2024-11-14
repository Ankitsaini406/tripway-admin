import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

const RequireAuth = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            router.push('/auth');
        }
    }, [currentUser, router]);

    if (!currentUser) return null;

    return children;
};

export default RequireAuth;
