import Container from "./Container";
import classes from "@/styles/ui/PopUp.module.css";

const PopUp = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Container className={`${classes["pop-up"]} ${className}`}>
      {children}
    </Container>
  );
};

export default PopUp;
