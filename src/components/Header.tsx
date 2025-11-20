import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 px-6 bg-background border-b shadow-sm">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">SKYRIDE</h1>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <NavLink to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          Home
        </NavLink>
        <NavLink to="/booking" className="text-muted-foreground hover:text-foreground transition-colors">
          Book a Ride
        </NavLink>
      </nav>
      <div className="flex items-center gap-4">
        <Button variant="outline">Sign In</Button>
        <Button>Sign Up</Button>
      </div>
    </header>
  );
};
