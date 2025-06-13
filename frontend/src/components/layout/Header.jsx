import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import LocationSearchMap from '../common/LocationSearchMap';
import SearchBar from '../search/SearchBar';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {UserCircleIcon} from '@heroicons/react/24/solid'

export default function Header({handleTextSearch, handleLocationSearch}) {
  const {isAuthenticated, user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchQuery = (query) => {
    if (handleTextSearch && query && query.query) {
      handleTextSearch(query.query);
    }
  };

  return (
    <header className='sticky py-4 top-0 bg-white shadow z-20'>
      <div className="container flex items-center justify-between">
        <Link to="/" className="text-3xl font-semibold flex items-center gap-3">
          <img
            className='w-[36px]'
            src="/images/logo.svg"
            alt="MUSA"/>
          MUSA
        </Link>
        <div className="flex items-center space-x-4">
          <SearchBar onSearch={handleSearchQuery}/>
          <LocationSearchMap onSearch={handleLocationSearch}/>
        </div>
        <ul className={"flex items-center space-x-6"}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/explore">Esplora</Link>
          </li>
          {!isAuthenticated &&
            <li>
              <Link to="/login">Accedi</Link>
            </li>
          }
          {isAuthenticated &&
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <UserCircleIcon className="size-6"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-3 bg-white">
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link to="/profile">Profilo</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          }
        </ul>
      </div>
    </header>
  );
}
