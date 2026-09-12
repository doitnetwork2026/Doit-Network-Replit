import React from 'react';
import { Booking, Provider } from '../../types/doit';
import { ServiceLocationMap } from './ServiceLocationMap';
import { Clock } from 'lucide-react';

interface LiveBookingTrackerMapProps {
  booking: Booking;
  provider?: Provider;
}

export const LiveBookingTrackerMap: React.FC<LiveBookingTrackerMapProps> = ({
  booking,
  provider,
}) => {
  const customerCoords = booking.coordinates || { lat: 23.2382, lng: 77.4665 };
  const providerCoords = provider?.coordinates || {
    lat: customerCoords.lat + 0.005,
    lng: customerCoords.lng + 0.007,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00c29e] animate-ping" />
          <span className="text-xs font-bold text-zinc-900">Live Provider Dispatch Tracker</span>
          <span className="text-[10px] text-zinc-400">OpenStreetMap</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-600" />
          <span>ETA ~ 10-15 Mins</span>
        </span>
      </div>

      <ServiceLocationMap
        serviceLocation={{
          latitude: customerCoords.lat,
          longitude: customerCoords.lng,
          address: booking.address,
          locality: booking.locality,
          landmark: booking.landmark,
          houseFlatNumber: booking.houseFlatNumber
        }}
        providerLocation={provider ? {
          latitude: providerCoords.lat,
          longitude: providerCoords.lng,
          name: provider.name
        } : undefined}
        title={`Service Quarter: ${booking.locality}`}
        height="280px"
        showNavigationButton={true}
      />
    </div>
  );
};
