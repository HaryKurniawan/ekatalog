import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { FileCheck, UploadCloud, Printer, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function PODetail({ poId, onBack }: { poId: string, onBack: () => void }) {
  const { pos, prs, users, pts, vendors, currentUser, uploadBuktiTransfer, updateVendorPOStatus } = useStore();
  const po = pos.find(p => p.id === poId);
  const pr = prs.find(p => p.id === po?.idPr);
  
  const [activeTab, setActiveTab] = useState<'detail' | 'pembayaran'>('detail');
  
  if (!po || !pr) return null;

  const vendor = vendors.find(v => v.id === po.idVendor);
  const kampus = pts.find(p => p.id === po.idPts);
  const pemohon = users.find(u => u.id === pr.pemohonId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-[11px] uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          ← Kembali
        </button>
        <h1 className="text-lg font-normal tracking-tight">Detail Purchase Order</h1>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-base font-normal tracking-tight">{po.nomorPo}</div>
            <div className="text-[11px] uppercase tracking-widest text-[var(--color-text-secondary)] mt-1">{new Date(po.tanggal).toLocaleDateString()}</div>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-surface)]">
              {po.statusPo}
            </span>
            <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border ${po.statusPembayaran === 'PAID' ? 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]/20' : 'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[var(--color-warning)]/20'}`}>
              {po.statusPembayaran === 'PAID' ? 'LUNAS' : 'BELUM DIBAYAR'}
            </span>
          </div>
        </div>

        <div className="flex border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <button 
            onClick={() => setActiveTab('detail')}
            className={`px-8 py-4 text-[11px] uppercase tracking-widest transition-colors relative ${activeTab === 'detail' ? 'text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
          >
            Informasi Item
            {activeTab === 'detail' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('pembayaran')}
            className={`px-8 py-4 text-[11px] uppercase tracking-widest transition-colors relative ${activeTab === 'pembayaran' ? 'text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
          >
            Pembayaran & BAST
            {activeTab === 'pembayaran' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)]" />
            )}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'detail' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono mb-2">Pemesan</div>
                  <div className="text-sm font-normal mb-1">{kampus?.nama}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">{pemohon?.nama}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono mb-2">Vendor</div>
                  <div className="text-sm font-normal">{vendor?.nama}</div>
                </div>
              </div>

              <div>
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="border-b border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
                    <tr>
                      <th className="pb-4 font-normal">Item</th>
                      <th className="pb-4 font-normal text-right">Qty</th>
                      <th className="pb-4 font-normal text-right">Harga Satuan</th>
                      <th className="pb-4 font-normal text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {pr.items.map((item, idx) => {
                      const prod = useStore.getState().produks.find(p => p.id === item.idProduk);
                      return (
                        <tr key={idx} className="hover:bg-[var(--color-background)] transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {prod?.gambar ? (
                                <img src={prod.gambar} alt={prod.nama} className="w-8 h-8 object-cover rounded-sm border border-[var(--color-border)]" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-8 h-8 bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm flex items-center justify-center text-[8px] text-[var(--color-text-secondary)]">No Img</div>
                              )}
                              <div className="text-[13px]">{prod?.nama || 'Produk'}</div>
                            </div>
                          </td>
                          <td className="py-4 text-right text-[13px]">{item.qty}</td>
                          <td className="py-4 text-right font-mono text-[11px] text-[var(--color-text-secondary)]">{formatRupiah(item.harga)}</td>
                          <td className="py-4 text-right font-mono text-[11px] text-[var(--color-text-primary)]">{formatRupiah(item.total)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-6 text-right text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Total PO</td>
                      <td className="pt-6 text-right font-normal tracking-tight text-lg">{formatRupiah(po.totalNominal)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'pembayaran' && (
            <div className="space-y-8 max-w-2xl">
              {currentUser?.role === 'AdminKampus' && po.statusPembayaran !== 'PAID' && (
                <div className="p-8 border border-[var(--color-border)] rounded-sm bg-[var(--color-background)] text-center">
                  <UploadCloud className="w-8 h-8 text-[var(--color-text-secondary)] mx-auto mb-4" />
                  <div className="text-sm font-normal mb-1">Unggah Bukti Transfer</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] mb-6 uppercase tracking-widest">Pembayaran langsung ke rekening vendor</div>
                  <button 
                    onClick={() => {
                      uploadBuktiTransfer(po.id);
                      alert('Bukti transfer berhasil diunggah (simulasi)');
                    }}
                    className="px-6 py-3 border border-[var(--color-border)] text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-colors"
                  >
                    Simulasi Upload
                  </button>
                </div>
              )}

              {po.buktiTransferUrl && (
                <div className="p-5 rounded-sm bg-[var(--color-background)] border border-[var(--color-border)] flex items-center gap-4">
                  <FileCheck className="w-5 h-5 text-[var(--color-success)]" />
                  <div>
                    <div className="text-sm font-normal mb-1">Bukti Transfer Diunggah</div>
                    <div className="text-[11px] font-mono text-[var(--color-text-secondary)]">{po.buktiTransferUrl}</div>
                  </div>
                </div>
              )}

              {currentUser?.role === 'Vendor' && po.buktiTransferUrl && po.statusPembayaran !== 'PAID' && (
                <div className="p-5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] mb-4 font-mono">Tindakan Vendor</div>
                  <button 
                    onClick={() => updateVendorPOStatus(po.id, 'COMPLETED', 'PAID')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 rounded-sm text-[10px] uppercase tracking-[0.1em] hover:bg-[var(--color-success)]/20 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Tandai Lunas & Selesai</span>
                  </button>
                </div>
              )}

              <div className="pt-6 border-t border-[var(--color-border)]">
                <button className="flex items-center gap-2 px-5 py-2.5 border border-[var(--color-border)] rounded-sm text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-colors">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak BAST Digital</span>
                </button>
                <div className="text-[11px] text-[var(--color-text-muted)] mt-3">Pratinjau Berita Acara Serah Terima</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
