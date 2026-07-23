import { useState } from 'react';
import { useStore } from '../store';
import { Plus, X } from 'lucide-react';

export default function CategoryList() {
  const { kategories, setKategories } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nama: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;
    
    const newKategori = {
      id: `cat-${Date.now().toString().slice(-4)}`,
      nama: formData.nama,
    };
    
    if (setKategories) {
      setKategories([...kategories, newKategori]);
    }
    
    setIsAddModalOpen(false);
    setFormData({ nama: '' });
  };
  
  return (
    <div className="space-y-6">
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-normal">Tambah Kategori</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Nama Kategori</label>
                <input
                  required
                  type="text"
                  value={formData.nama}
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
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
          <h1 className="text-lg font-normal tracking-tight">Kategori Produk Nasional</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Daftar kategori untuk e-Katalog APTISI</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-sm text-[10px] uppercase tracking-[0.1em] hover:bg-[var(--color-accent)]/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Kategori
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {kategories.map(cat => (
          <div key={cat.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-sm hover:border-[var(--color-text-muted)] transition-colors">
            <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono mb-1">{cat.id}</div>
            <div className="text-sm font-normal">{cat.nama}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
