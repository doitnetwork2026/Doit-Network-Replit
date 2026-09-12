import React from 'react';
import { LocationPicker } from './LocationPicker';
import { SavedAddress } from '../../types/doit';
import { X, MapPin } from 'lucide-react';

interface LocationSelectorMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocality: string;
  onSelectLocality: (locality: string) => void;
  onSaveFullAddress?: (address: SavedAddress) => void;
  initialAddress?: Partial<SavedAddress>;
}

export const LocationSelectorMapModal: React.FC<LocationSelectorMapModalProps> = ({
  isOpen,
  onClose,
  selectedLocality,
  onSelectLocality,
  onSaveFullAddress,
  initialAddress
}) => {
  if (!isOpen) return null;

  const handleSave = (location: SavedAddress) => {
    onSelectLocality(location.locality);
    if (onSaveFullAddress) {
      onSaveFullAddress(location);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#e6faf6] text-[#00c29e] flex items-center justify-center border border-[#99ede0]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                BHEL Bhopal — Interactive Service Location Picker
              </h3>
              <p className="text-[11px] text-zinc-500">
                Powered by OpenStreetMap • Drag pin to your exact quarter gate
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: LocationPicker */}
        <div className="p-3 sm:p-4 overflow-y-auto">
          <LocationPicker
            initialLocation={{
              ...initialAddress,
              locality: initialAddress?.locality || selectedLocality || 'BHEL Sector 2'
            }}
            onSaveLocation={handleSave}
            onCancel={onClose}
            allowSaveToProfile={true}
            title="Service Quarter & Address"
            subtitle="Pinpoint your residence for accurate technician matching"
            submitButtonText="Confirm & Use This Location"
          />
        </div>

      </div>
    </div>
  );
};
