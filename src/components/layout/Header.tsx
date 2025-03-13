
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
}

export const Header = ({ sidebarExpanded, toggleSidebar }: HeaderProps) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [title, setTitle] = useState('Tableau de bord');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    
    switch (path) {
      case '/':
        setTitle('Tableau de bord');
        break;
      case '/exam-management':
        setTitle('Gestion des Examens');
        break;
      case '/room-management':
        setTitle('Gestion des Salles');
        break;
      case '/schedule':
        setTitle('Planning des Examens');
        break;
      case '/students':
        setTitle('Gestion des Étudiants');
        break;
      case '/departments':
        setTitle('Gestion des Filières');
        break;
      case '/settings':
        setTitle('Paramètres');
        break;
      default:
        setTitle('Tableau de bord');
    }
  }, [location]);

  return (
    <header 
      className={cn(
        "sticky top-0 z-10 transition-all duration-200",
        scrolled ? "glass border-b border-border" : "bg-transparent"
      )}
    >
      <div className={cn(
        "flex items-center justify-between h-16 px-6",
        sidebarExpanded ? "lg:pl-72" : "lg:pl-28"
      )}>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-secondary lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold tracking-tight animate-in slide-in-from-top">{title}</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-10 h-9 w-64 rounded-full bg-secondary/50 border border-border text-sm focus:ring-1 focus:ring-primary focus-visible:outline-none"
            />
          </div>
          
          <button className="relative p-2 rounded-full hover:bg-secondary">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2 ml-2">
            <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              <span>A</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Admin</p>
            </div>
            <ChevronDown className="hidden md:block w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};
