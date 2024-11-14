import { AuthContextProvider } from "@/context/AuthContext";
import RequireAuth from "@/utils/RequireAuth";

function MyApp({ Component, pageProps }) {

    const protectedRoutes = ['/'];
    isProtected = protectedRoutes.includes(router.pathname);

    return (
        <AuthContextProvider>
            {
                !isProtected ? (
                    <RequireAuth>
                        <Component {...pageProps} />
                    </RequireAuth>
                ) : (
                    <Component {...pageProps} />
                )
            }
        </AuthContextProvider>
    );
}

export default MyApp;