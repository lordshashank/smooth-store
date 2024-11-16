import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <div
        className="not-found-container"
        style={{ padding: "4rem var(--b-pad)" }}
      >
        <h1>Not Found</h1>
        <p>Could not find requested resource</p>
        <Link href="/">Return Home</Link>
      </div>
    </>
  );
}
