import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function RequisitionerCatalog() {
  const { produks, kategories, addToCart } = useStore();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  const filtered = produks.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === 'all' || p.kategori === activeCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-4">
        <input 
          type="text"
          placeholder="Cari perangkat, alat lab, ATK..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded px-4 py-1.5 text-sm focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-muted)] transition-colors"
        />
        <div className="flex gap-3 items-center overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
          <span className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-widest mr-4 hidden sm:block">Filter Kategori:</span>
          <button 
            onClick={() => setActiveCat('all')}
            className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wide whitespace-nowrap border transition-colors ${activeCat === 'all' ? 'bg-[var(--color-accent)]/5 text-[var(--color-accent)] border-[var(--color-accent)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'}`}
          >
            Semua
          </button>
          {kategories.map(cat => (
             <button 
             key={cat.id}
             onClick={() => setActiveCat(cat.id)}
             className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wide whitespace-nowrap border transition-colors ${activeCat === cat.id ? 'bg-[var(--color-accent)]/5 text-[var(--color-accent)] border-[var(--color-accent)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'}`}
           >
             {cat.nama}
           </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(p => {
          const catName = kategories.find(c => c.id === p.kategori)?.nama;
          const vendorName = useStore.getState().vendors.find(v => v.id === p.idVendor)?.nama;
          return (
            <div key={p.id} className="group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-all rounded-sm overflow-hidden">
              <div className="aspect-video bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] flex items-center justify-center text-[var(--color-border)] relative overflow-hidden">
                {p.gambar ? (
                  <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <ShoppingCart className="w-12 h-12 opacity-50" />
                )}
              </div>
              <div className="p-5 space-y-4 flex flex-col flex-1">
                <div>
                  <p className="text-[10px] text-[var(--color-accent)] uppercase tracking-widest font-semibold truncate">{vendorName}</p>
                  <h3 className="text-sm font-normal mt-1 leading-tight line-clamp-2">{p.nama}</h3>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)]">{formatRupiah(p.harga)}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Stok: {p.stok} unit</p>
                  </div>
                  <button 
                    onClick={() => addToCart(p, 1)}
                    disabled={p.stok === 0}
                    className="text-[10px] uppercase tracking-[0.1em] border border-[var(--color-border)] px-3 py-1.5 hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--color-text-primary)]"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-[var(--color-text-secondary)] text-sm">
          Produk tidak ditemukan.
        </div>
      )}
    </div>
  );
}
