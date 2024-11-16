import classes from "@/styles/Page.module.css";
import Landing from "@/components/home/Landing";

export default function Page() {
  return (
    <>
      <main className={classes.main}>
        <Landing />
      </main>
    </>
  );
}
