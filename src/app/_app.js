import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
    return (
        <>
        <Component {...pageProps} />
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} closeOnClick />
        </>
    );
}

export default MyApp;