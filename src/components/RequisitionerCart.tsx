import { useState } from 'react';
import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { AlertCircle, Trash2, CheckCircle, X } from 'lucide-react';
import { CartItem } from '../types';

export default function RequisitionerCart() {
  const { cart, removeFromCart, vendors, submitPR, currentUser, rkats, units } = useStore();
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string, total: number, vendorName: string } | null>(null);

  if (!currentUser) return null;

  const userUnit = units.find(u => u.id === currentUser.idUnit);
  const userRkat = rkats.find(r => r.idUnit === currentUser.idUnit);
  const sisaPagu = userRkat ? userRkat.totalPagu - userRkat.paguTerpakai : 0;

  // Group cart by vendor
  const cartByVendor = cart.reduce((acc, item) => {
    const vId = item.produk.idVendor;
    if (!acc[vId]) acc[vId] = [];
    acc[vId].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const handleCheckout = (vendorId: string, items: CartItem[], total: number) => {
    setSubmitting(vendorId);
    setErrorMsg(null);
    
    // Simulate slight delay
    setTimeout(() => {
      const res = submitPR(vendorId, items, total);
      if (!res.success) {
        setErrorMsg(res.error || 'Terjadi kesalahan');
      } else {
        const vendor = vendors.find(v => v.id === vendorId);
        setSuccessData({
          id: res.id || 'PR-000',
          total,
          vendorName: vendor?.nama || 'Vendor'
        });
      }
      setSubmitting(null);
    }, 500);
  };

  if (cart.length === 0 && !successData) {
    return (
      <div className="text-center py-20 text-[var(--color-text-secondary)] text-sm">
        Keranjang belanja Anda kosong.
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSuccessData(null)}
              className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[var(--color-success-muted)] text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-normal tracking-tight">Pengajuan Berhasil Dibuat</h2>
              <p className="text-[11px] uppercase tracking-widest text-[var(--color-text-secondary)]">Nomor Referensi: {successData.id}</p>
              
              <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm p-4 text-left my-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-secondary)]">Vendor</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{successData.vendorName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-secondary)]">Total Pengajuan</span>
                  <span className="font-mono text-[var(--color-text-primary)]">{formatRupiah(successData.total)}</span>
                </div>
              </div>
              
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Pengajuan (PR) Anda telah dikirim dan sedang menunggu persetujuan berjenjang. Pagu anggaran Anda telah dikunci sementara.
              </p>
              
              <button 
                onClick={() => setSuccessData(null)}
                className="w-full mt-6 px-6 py-3 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)]/90 transition-colors"
              >
                Tutup & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Info */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.15em] font-medium">Pagu Anggaran Unit</p>
          <p className="text-xl font-normal">{userUnit?.nama} <span className="text-[var(--color-text-secondary)] text-sm ml-2 font-light">TA {userRkat?.tahun || new Date().getFullYear()}</span></p>
        </div>
        <div className="w-72 space-y-2 hidden sm:block">
          <div className="flex justify-between text-[11px] text-[var(--color-text-secondary)] tracking-wider uppercase">
            <span>Sisa Pagu: {formatRupiah(sisaPagu)}</span>
            <span>{userRkat ? Math.round((sisaPagu / userRkat.totalPagu) * 100) : 0}%</span>
          </div>
          <div className="h-[2px] bg-[var(--color-border)] w-full rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-success)]" style={{ width: `${userRkat ? Math.round((sisaPagu / userRkat.totalPagu) * 100) : 0}%` }}></div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-[var(--color-danger-muted)] border border-[var(--color-danger)]/20 text-[var(--color-danger)] px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMsg}
        </div>
      )}

      {Object.entries(cartByVendor).map(([vendorId, items]) => {
        const vendor = vendors.find(v => v.id === vendorId);
        const total = items.reduce((sum, item) => sum + (item.produk.harga * item.qty), 0);
        const exceedsBudget = total > sisaPagu;

        return (
          <div key={vendorId} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]">
              <div className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">{vendor?.nama}</div>
            </div>
            
            <div className="divide-y divide-[var(--color-border)]">
              {items.map(item => (
                <div key={item.produk.id} className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {item.produk.gambar ? (
                      <img src={item.produk.gambar} alt={item.produk.nama} className="w-12 h-12 object-cover rounded-sm border border-[var(--color-border)]" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-12 h-12 bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm flex items-center justify-center text-[10px] text-[var(--color-text-secondary)]">No Img</div>
                    )}
                    <div>
                      <div className="text-sm font-medium mb-1">{item.produk.nama}</div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {formatRupiah(item.produk.harga)} x {item.qty}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">
                      {formatRupiah(item.produk.harga * item.qty)}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.produk.id)}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-[var(--color-background)] border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[var(--color-text-secondary)] max-w-sm">
                * Anggaran dan stok akan langsung terkunci begitu pengajuan ini dikirim, sebelum disetujui atasan.
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-xs text-[var(--color-text-secondary)]">Total Pengajuan</div>
                  <div className={`text-lg font-medium tracking-tight ${exceedsBudget ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-primary)]'}`}>
                    {formatRupiah(total)}
                  </div>
                </div>
                <button
                  onClick={() => handleCheckout(vendorId, items, total)}
                  disabled={exceedsBudget || submitting === vendorId}
                  className="px-5 py-2.5 rounded-sm text-[10px] uppercase tracking-[0.1em] border border-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
                >
                  {submitting === vendorId ? 'Memproses...' : 'Buat PR'}
                </button>
              </div>
            </div>
            {exceedsBudget && (
              <div className="px-5 py-2 bg-[var(--color-danger)]/10 border-t border-[var(--color-danger)]/20 text-[var(--color-danger)] text-xs text-right">
                Anggaran tidak mencukupi untuk checkout ini.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
