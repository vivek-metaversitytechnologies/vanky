import "./globals.css";
import "../styles/variables.css";
import "../styles/customStyle.css";

import { Roboto_Condensed } from "next/font/google";
import { ReduxProvider } from "../components/ReduxProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto_Condensed({
  subsets: ["latin"],
});

export const metadata = {
  title: "Vanky",
  description: "Vanky",
  icons: {
    icon: [{ url: "/assets/images/favicon.ico?v=3" }],
    shortcut: "/assets/images/favicon.ico?v=3",
    apple: "/assets/images/favicon.ico?v=3",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link rel="icon" href="/assets/images/favicon.ico?v=3" sizes="any" />
        <link rel="shortcut icon" href="/assets/images/favicon.ico?v=3" />
      </head>
      <body suppressHydrationWarning className={roboto.className}>
        <ReduxProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
