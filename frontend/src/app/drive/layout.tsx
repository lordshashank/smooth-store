import classes from "@/styles/Drive.module.css";
import HeaderDrive from "@/components/HeaderDrive";
import DriveSidebar from "@/components/DriveSidebar";
import { FilesProvider } from "@/contexts/fileContext";
import { DriveProvider } from "@/contexts/DriveContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilesProvider>
      <DriveProvider>
        <section className={"drive-wrapper"}>
          {/* <HeaderDrive /> */}
          <div className={classes["drive-sidebar"]}>
            <DriveSidebar />
          </div>
          <div className={classes["page-container"]}>{children}</div>
        </section>
      </DriveProvider>
    </FilesProvider>
  );
}
