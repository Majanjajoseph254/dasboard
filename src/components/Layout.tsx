import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { clearSession } from '../services/auth';
import type { Session } from '../types';

interface LayoutProps {
  session: Session;
  children: React.ReactNode;
  onLogout: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/profile', label: 'Profile', icon: User },
];

function NavItem({
  to,
  label,
  icon: Icon,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
          isActive
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={clsx('h-5 w-5 flex-shrink-0', isActive ? 'text-white' : '')} />
          <span>{label}</span>
          {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-60" />}
        </>
      )}
    </NavLink>
  );
}

export default function Layout({ session, children, onLogout }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    onLogout();
    navigate('/login');
  };

  const initials = session.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside
      className={clsx(
        'flex flex-col h-full bg-white border-r border-gray-200',
        isMobile ? 'w-72' : 'w-64',
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <FolderKanban className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">ProjectHub</span>
        {isMobile && (
          <button
            className="ml-auto text-gray-400 hover:text-gray-700"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            onClick={isMobile ? () => setMobileOpen(false) : undefined}
          />
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{session.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 h-full">
            <Sidebar isMobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <FolderKanban className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">ProjectHub</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
