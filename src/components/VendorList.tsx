import { useState } from 'react';
import { useStore } from '../store';
import { CheckCircle, XCircle, Clock, Plus, X } from 'lucide-react';

export default function VendorList() {
  const { vendors, setVendors } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nama: '', statusKurasi: 'Pending' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;
    
    const newVendor = {
      id: `vendor-${Date.now().toString().slice(-4)}`,
      nama: formData.nama,
      statusKurasi: formData.statusKurasi as 'Approved' | 'Pending' | 'Rejected'
    };
    
    if (setVendors) {
      setVendors([...vendors, newVendor]);
    }
    
    setIsAddModalOpen(false);
    setFormData({ nama: '', statusKurasi: 'Pending' });
  };
  
  const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
    if (setVendors) {
      setVendors(vendors.map(v => v.id === id ? { ...v, statusKurasi: status } : v));
    }
  };

  return (
    <div className="space-y-6">
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-normal">Tambah Vendor</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Nama Vendor</label>
                <input
                  required
                  type="text"
                  value={formData.nama}
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Status Kurasi</label>
                <select
                  value={formData.statusKurasi}
                  onChange={e => setFormData({...formData, statusKurasi: e.target.value})}
                  className="w-full appearance-none bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-background)] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)]/90 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">Kurasi Vendor Nasional</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Daftar vendor yang terdaftar di APTISI</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-sm text-[10px] uppercase tracking-[0.1em] hover:bg-[var(--color-accent)]/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Vendor
        </button>
      </div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-6 py-4 font-normal">Nama Vendor</th>
              <th className="px-6 py-4 font-normal">Status Kurasi</th>
              <th className="px-6 py-4 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-sm">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-[var(--color-background)] transition-colors">
                <td className="px-6 py-4">{vendor.nama}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest border ${
                    vendor.statusKurasi === 'Approved' ? 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]/20' :
                    vendor.statusKurasi === 'Rejected' ? 'bg-[var(--color-danger-muted)] text-[var(--color-danger)] border-[var(--color-danger)]/20' :
                    'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[var(--color-warning)]/20'
                  }`}>
                    {vendor.statusKurasi === 'Approved' && <CheckCircle className="w-3 h-3" />}
                    {vendor.statusKurasi === 'Rejected' && <XCircle className="w-3 h-3" />}
                    {vendor.statusKurasi === 'Pending' && <Clock className="w-3 h-3" />}
                    {vendor.statusKurasi}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {vendor.statusKurasi === 'Pending' && (
                    <>
                      <button onClick={() => handleAction(vendor.id, 'Approved')} className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-success)] hover:text-white border border-[var(--color-success)]/30 hover:border-[var(--color-success)] hover:bg-[var(--color-success)] px-3 py-1.5 rounded-sm transition-colors">Setuju</button>
                      <button onClick={() => handleAction(vendor.id, 'Rejected')} className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-danger)] hover:text-white border border-[var(--color-danger)]/30 hover:border-[var(--color-danger)] hover:bg-[var(--color-danger)] px-3 py-1.5 rounded-sm transition-colors">Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
