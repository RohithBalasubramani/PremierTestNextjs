import { DM_Sans } from "next/font/google";
import "./globals.css";
import styles from "./page.module.css";

const dmSans = DM_Sans({
  weight: ["400", "500", "700", "100", "200", "300", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Premier Test",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <div className={styles.topbar}>Premier Test</div>
        {children}
      </body>
    </html>
  );
}
