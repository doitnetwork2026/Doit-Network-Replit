import React from 'react';
import { 
  Globe, 
  Smartphone, 
  Wrench, 
  LogIn
} from 'lucide-react';
import { UserRole } from '../../types/doit';

interface BottomNavProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole, targetTab?: string) => void;
  pendingKycCount: number;
  activeBookingsCount?: number;
  onOpenLogin: () => void;
}

interface BottomNavItem {
  id: UserRole | 'login';
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge: string | null;
  badgeColor?: string;
  targetTab?: string;
  onClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  onSelectRole,
  pendingKycCount,
  activeBookingsCount = 0,
  onOpenLogin,
}) => {
  const navItems: BottomNavItem[] = [
    {
      id: 'public' as UserRole,
      label: 'Explore',
      sublabel: 'Services & Sectors',
      icon: Globe,
      badge: null,
      targetTab: undefined,
    },
    {
      id: 'customer' as UserRole,
      label: 'Bookings',
      sublabel: 'Customer Portal',
      icon: Smartphone,
      badge: activeBookingsCount > 0 ? `${activeBookingsCount}` : null,
      badgeColor: 'bg-[#00c29e]',
      targetTab: 'bookings',
    },
    {
      id: 'provider' as UserRole,
      label: 'Partner',
      sublabel: 'Technician Desk',
      icon: Wrench,
      badge: pendingKycCount > 0 ? `${pendingKycCount} KYC` : null,
      badgeColor: 'bg-amber-500',
      targetTab: undefined,
    },
    {
      id: 'login',
      label: 'Login',
      sublabel: 'Account access',
      icon: LogIn,
      badge: null,
      onClick: onOpenLogin,
    },
  ];

  const handleNavClick = (item: BottomNavItem) => {
    if (item.onClick) {
      item.onClick();
    } else {
      onSelectRole(item.id as UserRole, item.targetTab);
    }
    // Guarantee window scrolls to top so view is immediately visible on mobile/tablet
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <nav 
      aria-label="Mobile and Tablet Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 block lg:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-2 sm:px-4 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),8px)] safe-area-inset-bottom"
    >
      <div className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto flex items-center justify-around gap-1 sm:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id !== 'login' && currentRole === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${item.label} (${item.sublabel})`}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 sm:px-3 rounded-2xl transition-all duration-150 cursor-pointer select-none active:scale-95 touch-manipulation min-h-[48px] ${
                isActive 
                  ? 'text-[#00755f] bg-[#e6faf6] border border-[#99ede0]/80 shadow-2xs font-bold' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70 border border-transparent'
              }`}
            >
              {/* Icon Container with Notification Badge */}
              <div className="relative flex items-center justify-center">
                <Icon 
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${
                    isActive 
                      ? 'text-[#00c29e] stroke-[2.3] scale-105' 
                      : 'text-zinc-500 stroke-[1.8]'
                  }`} 
                />

                {item.badge && (
                  <span 
                    className={`absolute -top-1.5 -right-2 text-[9px] font-bold text-white px-1.5 py-0.2 rounded-full shadow-xs leading-tight ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label & Tablet Sublabel */}
              <span className={`text-[11px] sm:text-xs tracking-tight mt-1 transition-colors leading-tight ${
                isActive ? 'font-bold text-zinc-900' : 'font-medium text-zinc-500'
              }`}>
                {item.label}
              </span>

              {/* Tablet-only subtle context descriptor */}
              <span className={`hidden sm:block text-[9px] mt-0.5 tracking-tight ${
                isActive ? 'text-[#00755f] font-semibold' : 'text-zinc-400'
              }`}>
                {item.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
