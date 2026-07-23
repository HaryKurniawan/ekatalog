import React, { useState } from 'react';
import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function ProductManager() {
  const { produks, kategories, currentUser, addProduk } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    harga: '',
    stok: '',
    gambar: ''
  });

  const vendorProduks = produks.filter(p => p.idVendor === currentUser?.idVendor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.idVendor) return;
    
    addProduk({
      idVendor: currentUser.idVendor,
      nama: formData.nama,
      kategori: formData.kategori,
      harga: Number(formData.harga),
      stok: Number(formData.stok),
      gambar: formData.gambar
    });
    
    setIsAddModalOpen(false);
    setFormData({ nama: '', kategori: '', harga: '', stok: '', gambar: '' });
  };

  return (
    <div className="space-y-6">
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-normal tracking-tight mb-6">Tambah Produk</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] mb-1.5">Nama Produk</label>
                <input
                  required
                  type="text"
                  value={formData.nama}
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] mb-1.5">Kategori</label>
                <select
                  required
                  value={formData.kategori}
                  onChange={e => setFormData({...formData, kategori: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="">Pilih Kategori</option>
                  {kategories.map(c => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] mb-1.5">Harga (Rp)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.harga}
                    onChange={e => setFormData({...formData, harga: e.target.value})}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] mb-1.5">Stok</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.stok}
                    onChange={e => setFormData({...formData, stok: e.target.value})}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] mb-1.5">URL Gambar (Opsional)</label>
                <input
                  type="text"
                  value={formData.gambar}
                  onChange={e => setFormData({...formData, gambar: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)]/90 transition-colors"
              >
                Simpan Produk
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">Kelola Produk</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Daftar etalase produk Anda</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-sm text-[10px] uppercase tracking-[0.1em] hover:bg-[var(--color-accent)]/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Produk
        </button>
      </div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-6 py-4 font-normal">Nama Produk</th>
              <th className="px-6 py-4 font-normal">Kategori</th>
              <th className="px-6 py-4 font-normal">Harga</th>
              <th className="px-6 py-4 font-normal">Stok</th>
              <th className="px-6 py-4 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-sm">
            {vendorProduks.map((prod) => {
              const cat = kategories.find(c => c.id === prod.kategori);
              return (
                <tr key={prod.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {prod.gambar ? (
                        <img src={prod.gambar} alt={prod.nama} className="w-10 h-10 object-cover rounded-sm border border-[var(--color-border)]" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm flex items-center justify-center text-[10px] text-[var(--color-text-secondary)]">No Img</div>
                      )}
                      <div className="text-[13px]">{prod.nama}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] uppercase tracking-wide text-[var(--color-text-secondary)]">{cat?.nama}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-[var(--color-text-primary)]">{formatRupiah(prod.harga)}</td>
                  <td className="px-6 py-4 font-mono text-[11px] text-[var(--color-text-secondary)]">{prod.stok} unit</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                      <Edit2 className="w-4 h-4 inline-block" />
                    </button>
                    <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors">
                      <Trash2 className="w-4 h-4 inline-block" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
