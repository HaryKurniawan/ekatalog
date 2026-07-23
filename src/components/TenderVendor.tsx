import { useState } from 'react';
import { useStore } from '../store';
import { Eye, X, Send, Clock, CheckCircle2 } from 'lucide-react';

export default function TenderVendor() {
  const { tenders, currentUser, applyTender, pts } = useStore();
  const [viewingTenderId, setViewingTenderId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  
  const [formData, setFormData] = useState({
    proposal: '',
    price: '',
  });

  if (!currentUser || currentUser.role !== 'Vendor') return null;

  const viewingTender = tenders.find(t => t.id === viewingTenderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.proposal || !formData.price || !viewingTenderId) return;
    
    applyTender(viewingTenderId, {
      vendorId: currentUser.id,
      tenderId: viewingTenderId,
      proposal: formData.proposal,
      price: Number(formData.price)
    });
    
    setIsApplying(false);
    setFormData({ proposal: '', price: '' });
  };

  return (
    <div className="space-y-6">
      {viewingTenderId && viewingTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-lg font-normal">{viewingTender.title}</h2>
                <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">
                  {pts.find(p => p.id === viewingTender.idPts)?.nama || viewingTender.idPts}
                </div>
              </div>
              <button 
                onClick={() => {
                  setViewingTenderId(null);
                  setIsApplying(false);
                }}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 space-y-4 p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm">
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Kategori Barang</h3>
                  <p className="text-sm">{viewingTender.kategori}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Jumlah (Qty)</h3>
                  <p className="text-sm">{viewingTender.jumlah}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Mekanisme Pembayaran</h3>
                  <p className="text-sm font-medium">
                    {viewingTender.paymentTerms === 'DP_25' ? 'DP 25%' : 
                     viewingTender.paymentTerms === 'DP_50' ? 'DP 50%' : 
                     'Lunas 100%'}
                  </p>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Spesifikasi Lengkap</h3>
                  <p className="text-sm whitespace-pre-wrap">{viewingTender.spesifikasi}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Deskripsi Tambahan</h3>
                  <p className="text-sm whitespace-pre-wrap text-[var(--color-text-primary)]">{viewingTender.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-between text-xs text-[var(--color-text-secondary)]">
                  <span>Target Waktu: {new Date(viewingTender.targetDate).toLocaleDateString()}</span>
                  <span>Status: {viewingTender.status}</span>
                </div>
              </div>

              {(() => {
                const myApp = viewingTender.applications.find(a => a.vendorId === currentUser.id);
                
                if (myApp) {
                  return (
                    <div className="p-4 border border-[var(--color-border)] rounded-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest border ${
                          myApp.status === 'APPROVED' ? 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]/20' :
                          myApp.status === 'REJECTED' ? 'bg-[var(--color-danger-muted)] text-[var(--color-danger)] border-[var(--color-danger)]/20' :
                          'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[var(--color-warning)]/20'
                        }`}>
                          {myApp.status === 'APPROVED' ? <CheckCircle2 className="w-3 h-3" /> : myApp.status === 'REJECTED' ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          Status Penawaran Anda: {myApp.status}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)] mb-1">Harga Ditawarkan</div>
                      <div className="font-mono text-lg mb-4">Rp {myApp.price.toLocaleString('id-ID')}</div>
                      <div className="text-xs text-[var(--color-text-secondary)] mb-1">Pesan Proposal</div>
                      <div className="text-sm bg-[var(--color-background)] p-3 rounded-sm border border-[var(--color-border)]">{myApp.proposal}</div>
                    </div>
                  );
                }

                if (viewingTender.status === 'CLOSED') {
                  return (
                    <div className="text-center py-6 text-sm text-[var(--color-text-secondary)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm">
                      Tender ini sudah ditutup.
                    </div>
                  );
                }

                if (!isApplying) {
                  return (
                    <div className="text-center pt-4 border-t border-[var(--color-border)]">
                      <button
                        onClick={() => setIsApplying(true)}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)]/90 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Ajukan Penawaran
                      </button>
                    </div>
                  );
                }

                return (
                  <form onSubmit={handleSubmit} className="space-y-4 border-t border-[var(--color-border)] pt-6">
                    <h3 className="text-sm font-medium mb-2">Form Pengajuan Penawaran</h3>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Harga Penawaran (Total Rp)</label>
                      <input
                        required
                        type="number"
                        min="1"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Proposal / Pesan (Detail Barang, Waktu, dll)</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.proposal}
                        onChange={e => setFormData({...formData, proposal: e.target.value})}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)] resize-none"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsApplying(false)}
                        className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-background)] transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)]/90 transition-colors"
                      >
                        Kirim Penawaran
                      </button>
                    </div>
                  </form>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">Peluang Tender Nasional</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Daftar permintaan pengadaan dari seluruh kampus</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenders.length === 0 ? (
          <div className="col-span-full text-center py-20 text-[var(--color-text-secondary)] text-sm border border-[var(--color-border)] rounded-sm">
            Saat ini tidak ada tender terbuka.
          </div>
        ) : (
          tenders.map(tender => {
            const kampus = pts.find(p => p.id === tender.idPts);
            const myApp = tender.applications.find(a => a.vendorId === currentUser.id);
            
            return (
              <div key={tender.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-sm hover:border-[var(--color-text-muted)] transition-colors flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                    {kampus?.nama || tender.idPts}
                  </div>
                  {tender.status === 'OPEN' ? (
                    <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" title="Open"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[var(--color-danger)]" title="Closed"></span>
                  )}
                </div>
                
                <h3 className="text-sm font-medium mb-2 leading-relaxed">{tender.title}</h3>
                
                <div className="text-xs text-[var(--color-text-secondary)] mb-6 flex-1 line-clamp-3">
                  {tender.description}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  {myApp ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--color-accent)] uppercase tracking-widest">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Diajukan
                    </div>
                  ) : (
                    <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest">
                      {tender.applications.length} Pendaftar
                    </div>
                  )}
                  <button
                    onClick={() => setViewingTenderId(tender.id)}
                    className="flex items-center gap-1.5 text-xs text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Detail
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
