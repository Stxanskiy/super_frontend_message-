import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/auth-service';
import { APP_STRINGS } from '@/constants/strings';

const Navigation = () => {
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              {APP_STRINGS.APP_NAME}
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md ${
                  location.pathname === '/' ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                {APP_STRINGS.HOME}
              </Link>
              <Link
                to="/chat"
                className={`px-3 py-2 rounded-md ${
                  location.pathname === '/chat' ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                {APP_STRINGS.CHATS}
              </Link>
              <Link
                to="/contacts"
                className={`px-3 py-2 rounded-md ${
                  location.pathname === '/contacts' ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                {APP_STRINGS.CONTACTS}
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md ${
                  location.pathname === '/profile' ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                {APP_STRINGS.PROFILE}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleLogout}>
              {APP_STRINGS.LOGOUT}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 