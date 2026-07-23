import { useState } from 'react';
import { useStore } from '../store';
import { Building, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function CampusList() {
  const { pts, setPts } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nama: '', status: 'Aktif' });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;
    
    // Simulate adding to store
    const newCampus = {
      id: `pts-${Date.now().toString().slice(-4)}`,
      nama: formData.nama,
      status: formData.status as 'Aktif' | 'NonAktif'
    };
    
    if (setPts) {
      setPts([...pts, newCampus]);
    }
    
    setIsAddModalOpen(false);
    setFormData({ nama: '', status: 'Aktif' });
  };
  
  return (
    <div className="space-y-6">
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-normal">Tambah Kampus</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Nama Kampus</label>
                <input
                  required
                  type="text"
                  value={formData.nama}
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full appearance-none bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="NonAktif">NonAktif</option>
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
          <h1 className="text-lg font-normal tracking-tight">Daftar Kampus (PTS)</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Kelola Perguruan Tinggi Swasta</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-sm text-[10px] uppercase tracking-[0.1em] hover:bg-[var(--color-accent)]/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Kampus
        </button>
      </div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden hover:border-[#444] transition-colors">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-6 py-4 font-normal">Nama Kampus</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-sm">
            {pts.map((kampus) => (
              <tr key={kampus.id} className="hover:bg-[var(--color-background)] transition-colors">
                <td className="px-6 py-4">
                  <div className="text-[13px]">{kampus.nama}</div>
                  <div className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">{kampus.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest border ${
                    kampus.status === 'Aktif' ? 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]/20' :
                    'bg-[var(--color-danger-muted)] text-[var(--color-danger)] border-[var(--color-danger)]/20'
                  }`}>
                    {kampus.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                    <Edit2 className="w-4 h-4 inline-block" />
                  </button>
                  <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors">
                    <Trash2 className="w-4 h-4 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
