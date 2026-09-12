import React, { useState } from 'react';
import { ServiceCategory, PricingModel } from '../../types/doit';
import { Plus, Edit2, Check, X, Shield, DollarSign, Layers } from 'lucide-react';

interface AdminCategoriesTabProps {
  categories: ServiceCategory[];
  onUpdateCategoryPrice: (categoryId: string, startingPrice: number, doitCommissionPct: number) => void;
  onToggleCategoryActive?: (categoryId: string) => void;
  onAddNewCategory?: (newCategory: ServiceCategory) => void;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  onUpdateCategoryPrice,
  onToggleCategoryActive,
  onAddNewCategory
}) => {
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCommission, setEditCommission] = useState<number>(10);

  // New category modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatForm, setNewCatForm] = useState({
    name: '',
    description: '',
    pricingModel: 'Fixed' as PricingModel,
    startingPrice: 350,
    doitCommissionPct: 10,
    subServices: 'Routine inspection, Basic repair'
  });

  const handleStartEdit = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setEditPrice(cat.startingPrice);
    setEditCommission(cat.doitCommissionPct);
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;
    onUpdateCategoryPrice(editingCategory.id, editPrice, editCommission);
    setEditingCategory(null);
  };

  const handleCreateCategory = () => {
    if (!newCatForm.name) return;
    const catId = newCatForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-') as any;
    const newCat: ServiceCategory = {
      id: catId,
      name: newCatForm.name,
      shortDesc: newCatForm.description || `Verified ${newCatForm.name} services in BHEL Bhopal.`,
      fullDesc: newCatForm.description || `Verified and skilled ${newCatForm.name} providers for residents across BHEL Township and nearby Bhopal zones.`,
      icon: 'Briefcase',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      startingPrice: Number(newCatForm.startingPrice) || 350,
      pricingModel: newCatForm.pricingModel,
      estimatedDuration: '2 - 3 Hours',
      doitCommissionPct: Number(newCatForm.doitCommissionPct) || 10,
      subServices: newCatForm.subServices.split(',').map(s => s.trim()).filter(Boolean),
      requirements: ['Standard equipment and verified credentials'],
      popularInBhel: false,
      displayOrder: categories.length + 1,
      isActive: true
    };

    if (onAddNewCategory) {
      onAddNewCategory(newCat);
    }
    setIsAddModalOpen(false);
    setNewCatForm({
      name: '',
      description: '',
      pricingModel: 'Fixed',
      startingPrice: 350,
      doitCommissionPct: 10,
      subServices: 'Routine inspection, Basic repair'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Service Category Catalog</h3>
          <p className="text-xs text-zinc-500">Configure BHEL service categories, base rates, commission splits, and active visibility.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <div 
            key={cat.id} 
            className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#e6faf6] border border-[#99ede0] text-[#00755f] flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{cat.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-mono">ID: {cat.id}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  cat.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {cat.isActive !== false ? 'Active' : 'Hidden'}
                </span>
              </div>

              <p className="text-xs text-zinc-600 mt-2 line-clamp-2">{cat.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 font-medium block">Starting Base</span>
                  <span className="font-bold text-zinc-900">₹{cat.startingPrice}</span>
                  <span className="text-[9px] text-zinc-500 block capitalize">{cat.pricingModel || cat.pricingType}</span>
                </div>

                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 font-medium block">DOIT Commission</span>
                  <span className="font-bold text-[#00755f]">{cat.doitCommissionPct}%</span>
                  <span className="text-[9px] text-zinc-500 block">Coordination fee</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase block mb-1">Sub-Services</span>
                <div className="flex flex-wrap gap-1">
                  {cat.subServices.slice(0, 3).map((sub, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                      {sub}
                    </span>
                  ))}
                  {cat.subServices.length > 3 && (
                    <span className="text-[10px] px-1 text-zinc-400 font-bold">
                      +{cat.subServices.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">Order: #{cat.displayOrder || idx + 1}</span>
              <button
                onClick={() => handleStartEdit(cat)}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Pricing</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Price Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="text-sm font-bold text-zinc-900">Edit {editingCategory.name} Rate Card</h4>
              <button onClick={() => setEditingCategory(null)} className="text-zinc-400 hover:text-zinc-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Starting Price (₹)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={e => setEditPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Platform Commission (%)</label>
                <input
                  type="number"
                  value={editCommission}
                  onChange={e => setEditCommission(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 rounded-lg bg-[#00c29e] hover:bg-[#00a887] text-white font-bold text-xs"
              >
                Save Rate Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="text-sm font-bold text-zinc-900">Add Service Category</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Category Name *</label>
                <input
                  type="text"
                  value={newCatForm.name}
                  onChange={e => setNewCatForm({ ...newCatForm, name: e.target.value })}
                  placeholder="e.g. Electrician / Appliance Repair"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Pricing Model</label>
                <select
                  value={newCatForm.pricingModel}
                  onChange={e => setNewCatForm({ ...newCatForm, pricingModel: e.target.value as PricingModel })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none bg-white"
                >
                  <option value="Fixed">Fixed Price</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Inspection + Quote">Inspection + Quote</option>
                  <option value="Subscription">Monthly Subscription</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Starting Price (₹)</label>
                  <input
                    type="number"
                    value={newCatForm.startingPrice}
                    onChange={e => setNewCatForm({ ...newCatForm, startingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">DOIT Fee (%)</label>
                  <input
                    type="number"
                    value={newCatForm.doitCommissionPct}
                    onChange={e => setNewCatForm({ ...newCatForm, doitCommissionPct: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Sub-Services (comma separated)</label>
                <textarea
                  rows={2}
                  value={newCatForm.subServices}
                  onChange={e => setNewCatForm({ ...newCatForm, subServices: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                />
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
                onClick={handleCreateCategory}
                className="px-3 py-1.5 rounded-lg bg-[#00c29e] hover:bg-[#00a887] text-white font-bold text-xs"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
