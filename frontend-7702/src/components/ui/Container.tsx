import classes from "@/styles/ui/Container.module.css";
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}
const Container = ({ children, className }: ContainerProps) => {
  return <div className={`${className} ${classes.container}`}>{children}</div>;
};

export default Container;
