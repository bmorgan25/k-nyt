import { Navbar } from "@/components/navbar";
import { AppProps } from "next/app";
import SessionProviderWrapper from "../components/SessionProvider"; // Adjust path if needed
import styles from "./styles.module.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProviderWrapper>
      <Navbar />
      <div className={styles["home-content"]}>
        <Component {...pageProps} />
      </div>
    </SessionProviderWrapper>
  );
}

export default MyApp;
