import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    currentUser: null, // Start with null to avoid SSR issues
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        // Only access localStorage on the client
            const storedUser = JSON.parse(localStorage.getItem("admin"));
            if (storedUser) {
                dispatch({ type: "SET_CURRENT_USER", payload: storedUser });
            }
    }, []);

    useEffect(() => {
        if (state.currentUser !== null) {
            localStorage.setItem("admin", JSON.stringify(state.currentUser));
        }
    }, [state.currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
