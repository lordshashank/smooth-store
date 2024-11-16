import "../styles/globals.css";
import { Roboto } from "next/font/google";
import Script from "next/script";
import NotificationProvider from "@/contexts/NotificationContext";
import DynamicProviders from "@/components/providers/DyanmicProviders";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata = {
  title: "Smooth Store",
};
export default function RootLayout({
  children,
  home,
}: {
  children: React.ReactNode;
  home: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script src="https://saturn.tech/widget.js"></Script>
      <link rel="icon" href="/logo.svg" sizes="any" />
      <body className={roboto.className}>
        <NotificationProvider>
          <DynamicProviders>
            {children}
            {home}
          </DynamicProviders>
        </NotificationProvider>
      </body>
    </html>
  );
}
