import UserButton from "../UserButton";
import HStack from "../ui/stack/HStack";
import NavbarSkeleton from "./NavbarSkeleton";

const WelcomeNavbar = () => {
  return (
    <NavbarSkeleton
      links={[]}
      rightContent={
        <HStack>
          <UserButton />
        </HStack>
      }
    />
  );
};

export default WelcomeNavbar;
