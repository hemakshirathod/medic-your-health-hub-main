import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, User, LogOut, ShieldAlert } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useEffect, useState } from 'react';

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(storage.getUser());
  }, []);

  const handleLogout = () => {
    storage.removeUser();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="rounded-lg bg-primary p-1.5">
            <Heart className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <span className="text-xl font-bold text-foreground">Medic</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/appointments" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Appointments
          </Link>
          <Link to="/health-records" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Records
          </Link>
          <Link to="/medicines" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Medicines
          </Link>
          <Link to="/lab-tests" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Lab Tests
          </Link>
          <Link to="/ai-assistant" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            AI Assistant
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
              <ShieldAlert className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/emergency">
            <Button variant="destructive" size="sm" className="font-semibold">
              Emergency
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
