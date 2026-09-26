import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoitLogo } from './DoitLogo';
import { 
  UserRole 
} from '../../types/doit';
import { 
  Globe, 
  Smartphone, 
  Wrench, 
  ShieldCheck, 
  MapPin, 
  RotateCcw,
  Menu,
  X,
  ChevronRight,
  Phone,
  Layers,
  ChevronDown,
  Map as MapIcon,
  LogIn
} from 'lucide-react';
import { LocationSelectorMapModal } from '../maps/LocationSelectorMapModal';

interface RoleSwitcherHeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  selectedLocality: string;
  onSelectLocality: (locality: string) => void;
  pendingKycCount: number;
  unassignedBookingsCount: number;
  onResetData: () => void;
  onOpenLogin: () => void;
}

export const RoleSwitcherHeader: React.FC<RoleSwitcherHeaderProps> = ({
  currentRole,
  onSelectRole,
  selectedLocality,
  onSelectLocality,
  pendingKycCount,
  unassignedBookingsCount,
  onResetData,
  onOpenLogin,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const localities = [
    'BHEL Area, Bhopal',
    'BHEL Sector 1',
    'BHEL Sector 2',
    'BHEL Sector 3',
    'BHEL Sector 4',
    'BHEL Sector 5',
    'BHEL Sector 6',
    'Piplani',
    'Govindpura',
    'Indrapuri',
    'Ayodhya Nagar'
  ];

  const quickNavServices = [
    { name: 'Gardener', desc: 'Lawn, hedge trimming, planting' },
    { name: 'Maid / Housekeeping', desc: 'Floor, kitchen, deep dusting' },
    { name: 'Painter', desc: 'Quarter repaint & touchup' },
    { name: 'Elder Caretaker', desc: 'Assistance, medication, companion' },
    { name: 'Township Cook', desc: 'Home-style meals, hygienic' },
    { name: 'Driver', desc: 'City, airport & local pickup' },
    { name: 'Electrician', desc: 'Wiring, MCB, appliances' },
    { name: 'Plumber', desc: 'Leakage, taps, water tank' },
  ];

  const desktopRoles = [
    { id: 'public' as UserRole, label: 'Explore', icon: Globe },
    { id: 'customer' as UserRole, label: 'Customer App', icon: Smartphone },
    { 
      id: 'provider' as UserRole, 
      label: 'Partner App', 
      icon: Wrench,
      badge: pendingKycCount > 0 ? `${pendingKycCount}` : null,
      badgeColor: 'bg-amber-500'
    },
    { 
      id: 'admin' as UserRole, 
      label: 'Admin Hub', 
      icon: ShieldCheck,
      badge: unassignedBookingsCount > 0 ? `${unassignedBookingsCount}` : null,
      badgeColor: 'bg-[#00c29e]'
    },
  ];

  const handleSelectRoleAndClose = (role: UserRole) => {
    onSelectRole(role);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between py-2.5 gap-1.5 sm:gap-4">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <motion.div 
              onClick={() => onSelectRole('public')}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
            >
              <DoitLogo className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-105 transition-transform" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm sm:text-lg tracking-tight text-zinc-900 whitespace-nowrap">Doit Network</span>
                  <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-[#e6faf6] text-[#00755f] border border-[#99ede0]">
                    Bhopal
                  </span>
                  {currentRole !== 'public' && (
                    <span className="lg:hidden text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#00755f] text-white shadow-2xs">
                      {currentRole === 'customer' ? 'Customer' : currentRole === 'provider' ? 'Partner' : 'Admin'}
                    </span>
                  )}
                </div>
                <p className="hidden sm:block text-[10px] sm:text-[11px] text-zinc-400 -mt-0.5 font-normal">Hyperlocal Home Services</p>
              </div>
            </motion.div>
          </div>

          {/* Desktop Role Navigation (Visible ONLY on Desktop >= lg) */}
          <nav aria-label="Desktop Workspace Switcher" className="hidden lg:flex items-center gap-1 p-1 bg-zinc-100/80 rounded-2xl border border-zinc-200/80">
            {desktopRoles.map((role) => {
              const Icon = role.icon;
              const isActive = currentRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => onSelectRole(role.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-zinc-900' 
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktopActiveTabPill"
                      className="absolute inset-0 bg-white rounded-xl shadow-2xs border border-zinc-200/80 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00c29e]' : 'text-zinc-400'}`} />
                  <span>{role.label}</span>
                  {role.badge && (
                    <span className={`text-[9px] font-bold text-white px-1.5 py-0.2 rounded-full ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Locality Selector on all screens + Desktop More Menu button ONLY on lg: */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Locality Selector Pill with Google Map trigger */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 rounded-full px-2 sm:px-3 py-1 text-xs text-zinc-600 transition-colors shrink-0">
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                title="Open BHEL Hyperlocal Map"
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#00c29e] shrink-0 animate-bounce" />
              </button>
              <select
                aria-label="Select locality"
                value={selectedLocality}
                onChange={(e) => onSelectLocality(e.target.value)}
                className="bg-transparent text-xs text-zinc-800 font-medium focus:outline-none cursor-pointer pr-1 max-w-[112px] sm:max-w-[160px] truncate"
              >
                {localities.map((loc) => (
                  <option key={loc} value={loc} className="bg-white text-zinc-900">
                    {loc}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                title="Select on BHEL Map"
                className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold text-[#00755f] bg-[#e6faf6] hover:bg-[#d0f5ee] px-1.5 py-0.5 rounded-full border border-[#99ede0] transition-colors cursor-pointer"
              >
                <MapIcon className="w-2.5 h-2.5" />
                <span>Map</span>
              </button>
            </div>

            {/* Desktop-Only More Options Dropdown Button (Completely HIDDEN on mobile & tablet) */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Desktop menu options"
                aria-expanded={isMenuOpen}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isMenuOpen
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200/90 shadow-2xs hover:border-zinc-300'
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Dropdown Menu (Desktop only) */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs transition-opacity hidden lg:block" 
              />

              {/* Dropdown panel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className="hidden lg:flex absolute right-4 sm:right-6 lg:right-8 top-full mt-2 w-96 bg-white rounded-2xl border border-zinc-200 shadow-2xl z-50 overflow-hidden flex-col max-h-[calc(100vh-80px)] origin-top-right"
              >
                
                {/* Dropdown Header */}
                <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
                  <div className="flex items-center gap-2">
                    <DoitLogo className="w-7 h-7" rounded="rounded-lg" />
                    <div>
                      <h3 className="font-bold text-xs text-zinc-900">Doit Network</h3>
                      <p className="text-[10px] text-zinc-500">Hyperlocal Home Services • BHEL Bhopal</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-zinc-200/70 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-4 space-y-4 overflow-y-auto flex-1">

                  {/* Account access */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenLogin();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#00755f] hover:bg-[#005f4d] text-white shadow-sm transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                        <LogIn className="w-4 h-4" />
                      </span>
                      <span>
                        <span className="block text-xs font-bold">Login / Register</span>
                        <span className="block text-[10px] text-white/75">Access bookings or partner tools</span>
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  
                  {/* Quick Services Navigation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Quick Service Catalog
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        BHEL Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {quickNavServices.map((srv) => (
                        <button
                          key={srv.name}
                          onClick={() => handleSelectRoleAndClose('customer')}
                          className="p-2 rounded-xl bg-zinc-50 hover:bg-[#e6faf6] border border-zinc-100 hover:border-[#99ede0] text-left transition-all cursor-pointer group"
                        >
                          <div className="text-[11px] font-semibold text-zinc-900 group-hover:text-[#00755f] truncate">
                            {srv.name}
                          </div>
                          <p className="text-[9px] text-zinc-400 truncate">{srv.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Support & Reset */}
                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5 text-zinc-600">
                      <Phone className="w-3.5 h-3.5 text-[#00c29e]" />
                      <span>Desk: +91 94250 DOIT</span>
                    </div>
                    <button
                      onClick={() => {
                        onResetData();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 font-medium cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-zinc-400" />
                      <span>Reset Data</span>
                    </button>
                  </div>

                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hyperlocal Location Selector Google Map Modal */}
        <LocationSelectorMapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          selectedLocality={selectedLocality}
          onSelectLocality={onSelectLocality}
        />

      </div>
    </header>
  );
};

export default RoleSwitcherHeader;
