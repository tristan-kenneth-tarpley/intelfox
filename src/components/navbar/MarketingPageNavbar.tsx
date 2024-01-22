import { routes } from "@/app/routes";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Button from "../ui/Button";
import HStack from "../ui/stack/HStack";
import NavbarSkeleton from "./NavbarSkeleton";
import UserButton from "../UserButton";

const MarketingPageNavbar = () => {
  return (
    <NavbarSkeleton
      links={
        [
          // <Button key={1} href={routes.teamHome({ teamId: team.id })} variant='ghost'>Home</Button>,
          // <Button key={2} href={routes.teamKeyPhrases({ teamId: team.id })} variant='ghost'>Key phrases</Button>,
          // <Button key={3} variant="ghost">Competitors</Button>,
        ]
      }
      rightContent={
        <HStack>
          <SignedIn>
            <Button variant="outline" href={routes.home()}>
              Dashboard
            </Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button href={routes.login()} variant="outline">
              Login
            </Button>
            <Button href={routes.signup()}>Signup</Button>
          </SignedOut>
        </HStack>
      }
    />
  );
};

export default MarketingPageNavbar;
