import React, { useState } from 'react';
import { ServiceArea } from '../../types/doit';
import { MapPin, Plus, Check, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminServiceAreasTabProps {
  serviceAreas: ServiceArea[];
  onToggleAreaActive?: (areaId: string) => void;
  onAddNewArea?: (newArea: ServiceArea) => void;
}

export const AdminServiceAreasTab: React.FC<AdminServiceAreasTabProps> = ({
  serviceAreas: initialAreas,
  onToggleAreaActive,
  onAddNewArea
}) => {
  const [areas, setAreas] = useState<ServiceArea[]>(initialAreas);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAreaForm, setNewAreaForm] = useState({
    name: '',
    sector: 'Sector 4',
    pincode: '462022',
    demandLevel: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW'
  });

  const handleToggle = (id: string) => {
    setAreas(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    if (onToggleAreaActive) onToggleAreaActive(id);
  };

  const handleAddArea = () => {
    if (!newAreaForm.name) return;
    const newArea: ServiceArea = {
      id: `AREA-${Date.now().toString().slice(-4)}`,
      name: newAreaForm.name,
      bhelSector: newAreaForm.sector,
      city: 'Bhopal',
      pincode: newAreaForm.pincode,
      isActive: true,
      serviceRadiusKm: 5,
      demandLevel: newAreaForm.demandLevel
    };
    setAreas(prev => [...prev, newArea]);
    if (onAddNewArea) onAddNewArea(newArea);
    setIsAddModalOpen(false);
    setNewAreaForm({
      name: '',
      sector: 'Sector 4',
      pincode: '462022',
      demandLevel: 'MEDIUM'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">BHEL Township Coverage & Sectors</h3>
          <p className="text-xs text-zinc-500">Manage hyperlocal operational zones, demand indicators, and delivery radii.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service Area</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map(area => (
          <div 
            key={area.id}
            className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00c29e]" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{area.name || area.locality}</h4>
                  <span className="text-[10px] text-zinc-400 font-medium">{area.bhelSector || area.zone || 'Township Zone'} • {area.pincode}</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                String(area.demandLevel).toUpperCase() === 'HIGH' || String(area.demandLevel).toUpperCase() === 'SURGING'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : String(area.demandLevel).toUpperCase() === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-zinc-100 text-zinc-600'
              }`}>
                {area.demandLevel} DEMAND
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-100">
              <span className="text-zinc-500 text-[11px]">Radius: {area.serviceRadiusKm || 5} KM</span>
              <button
                onClick={() => handleToggle(area.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  area.isActive 
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {area.isActive ? 'Active Coverage' : 'Paused'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="text-sm font-bold text-zinc-900">Add Service Locality</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Locality Name *</label>
                <input
                  type="text"
                  value={newAreaForm.name}
                  onChange={e => setNewAreaForm({ ...newAreaForm, name: e.target.value })}
                  placeholder="e.g. BHEL Sector 4 Officers Enclave"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Township Sector</label>
                <input
                  type="text"
                  value={newAreaForm.sector}
                  onChange={e => setNewAreaForm({ ...newAreaForm, sector: e.target.value })}
                  placeholder="e.g. BHEL Sector 4"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Pincode</label>
                <input
                  type="text"
                  value={newAreaForm.pincode}
                  onChange={e => setNewAreaForm({ ...newAreaForm, pincode: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Demand Level</label>
                <select
                  value={newAreaForm.demandLevel}
                  onChange={e => setNewAreaForm({ ...newAreaForm, demandLevel: e.target.value as any })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none bg-white"
                >
                  <option value="HIGH">High Demand</option>
                  <option value="MEDIUM">Medium Demand</option>
                  <option value="LOW">Low Demand</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddArea}
                className="px-3 py-1.5 rounded-lg bg-[#00c29e] hover:bg-[#00a887] text-white font-bold text-xs"
              >
                Add Area
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
