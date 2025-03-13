
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Home, 
  Layout, 
  Menu, 
  Settings, 
  School,
  ChevronLeft,
  Users,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  expanded: boolean;
  className?: string;
}

const NavItem = ({ to, icon: Icon, label, expanded, className }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "group flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 ease-spring",
        isActive 
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        !expanded && "justify-center",
        className
      )}
    >
      <Icon className={cn("flex-shrink-0", expanded ? "mr-3 h-5 w-5" : "h-6 w-6")} />
      {expanded && (
        <span className="text-sm font-medium animate-in slide-in-from-right">{label}</span>
      )}
    </NavLink>
  );
};

export const Sidebar = () => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(!isMobile);
  const location = useLocation();

  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [location, isMobile]);

  const navigation = [
    { to: '/', icon: Home, label: 'Tableau de bord' },
    { to: '/exam-management', icon: BookOpen, label: 'Examens' },
    { to: '/room-management', icon: Layout, label: 'Salles' },
    { to: '/schedule', icon: Calendar, label: 'Planning' },
    { to: '/students', icon: Users, label: 'Étudiants' },
    { to: '/departments', icon: School, label: 'Filières' }
  ];

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col bg-sidebar shadow-sidebar border-r border-sidebar-border transition-all duration-300 ease-spring",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {expanded ? (
          <div className="flex items-center animate-in slide-in-from-right">
            <School className="w-6 h-6 text-primary mr-2" />
            <span className="font-display text-lg font-semibold">Exam Planner</span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <School className="w-8 h-8 text-primary" />
          </div>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center p-1 ml-auto text-sidebar-foreground rounded-md opacity-70 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform duration-200", 
            !expanded && "rotate-180"
          )} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {navigation.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            expanded={expanded}
          />
        ))}
      </div>

      <div className="px-2 py-3 border-t border-sidebar-border">
        <NavItem
          to="/settings"
          icon={Settings}
          label="Paramètres"
          expanded={expanded}
          className="mt-auto"
        />
      </div>
    </div>
  );
};
