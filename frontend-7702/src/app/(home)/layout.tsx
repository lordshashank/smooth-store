import Header from "@/components/Header";

export const metadata = {
  title: "Smooth Store",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="home-page-container">{children}</div>;
}
