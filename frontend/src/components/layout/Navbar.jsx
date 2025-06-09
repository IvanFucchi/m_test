import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LocationSearchMap from '../common/LocationSearchMap';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '../shad-ui/navigation-menu';
import { Avatar, AvatarImage, AvatarFallback } from '../shad-ui/avatar';
import { ChevronDown } from 'lucide-react';

export default function Navbar({ handleSearch }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-zinc-950 text-white shadow-md">
      <div className="container-custom py-3 flex items-center justify-between">
        <Link to="/">
          <img src="/images/logo.png" alt="MUSA Logo" className="h-24" />
        </Link>

        <LocationSearchMap onSearch={handleSearch} />

        {/* Shadcn NavigationMenu */}
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex items-center space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/" className="px-3 py-2 rounded hover:bg-zinc-800">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/explore" className="px-3 py-2 rounded hover:bg-zinc-800">Esplora</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {isAuthenticated ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center px-3 py-2 rounded hover:bg-zinc-800 group"> {/*  nome utente  */}
                  <span className="text-base mr-1">{user.name}</span>
                  {/* <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" /> */}
                  <Link to="/profile" className="ml-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className=" absolute bg-zinc-800 w-48 rounded-md shadow-lg border border-zinc-700"> {/* contenitore */}
                  <ul className="py-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/profile" className="block px-4 py-2 hover:bg-zinc-700">Profilo</Link>
                      </NavigationMenuLink>
                    </li>
                    {user.role === 'admin' && (
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/admin" className="block px-4 py-2 hover:bg-zinc-700">Dashboard Admin</Link>
                        </NavigationMenuLink>
                      </li>
                    )}
                    <li>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-zinc-700">Logout</button>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/login" className="px-3 py-2 rounded hover:bg-zinc-800">Login</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
