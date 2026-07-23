import { useState } from 'react';
import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { Check, X, Eye } from 'lucide-react';

export default function ApproverQueue() {
  const { prs, currentUser, approvePR, rejectPR, users } = useStore();
  const [selectedPr, setSelectedPr] = useState<string | null>(null);
  const [catatan, setCatatan] = useState('');

  if (!currentUser) return null;

  // Filter PRs that need approval at current user's level
  // Simple check: pending PR, currentApprovalLevel matches the user's config level.
  // We need to look up the approvalConfigs to see which level this user is responsible for.
  const { approvalConfigs } = useStore.getState();
  
  // Find config for this approver
  const userConfig = approvalConfigs.find(c => c.roleApprover === currentUser.jabatan && c.idPts === currentUser.idPts);
  
  // Also consider fallback (Admin Kampus default approval if no config)
  let pendingPRs = [];
  if (userConfig) {
    pendingPRs = prs.filter(pr => pr.status === 'PENDING_APPROVAL' && pr.currentApprovalLevel === userConfig.levelUrutan && pr.idPts === currentUser.idPts);
  } else if (currentUser.role === 'AdminKampus') {
    // Check for fallback: PR level 1 but no level 1 config exists
    const hasLevel1Config = approvalConfigs.some(c => c.levelUrutan === 1 && c.idPts === currentUser.idPts);
    if (!hasLevel1Config) {
       pendingPRs = prs.filter(pr => pr.status === 'PENDING_APPROVAL' && pr.currentApprovalLevel === 1 && pr.idPts === currentUser.idPts);
    }
  }

  const handleAction = (prId: string, type: 'APPROVE' | 'REJECT') => {
    if (type === 'APPROVE') {
      approvePR(prId, catatan);
    } else {
      rejectPR(prId, catatan);
    }
    setCatatan('');
    setSelectedPr(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">Antrean Persetujuan</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Membutuhkan tindakan Anda sebagai {currentUser.jabatan || 'Admin'}</p>
        </div>
      </div>

      {pendingPRs.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-secondary)] text-sm border border-[var(--color-border)] rounded-sm">
          Tidak ada antrean persetujuan saat ini.
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPRs.map(pr => {
            const pemohon = users.find(u => u.id === pr.pemohonId);
            return (
              <div key={pr.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 group hover:border-[var(--color-text-muted)] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium">{pr.id}</span>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm bg-[var(--color-warning-muted)] text-[var(--color-warning)] border border-[var(--color-warning)]/20">Menunggu</span>
                    </div>
                    <div className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wide">Diajukan oleh {pemohon?.nama} &bull; {new Date(pr.tanggal).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Total</div>
                    <div className="text-base font-normal tracking-tight text-[var(--color-text-primary)]">{formatRupiah(pr.totalNominal)}</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--color-border)] flex flex-wrap gap-3">
                  <button 
                    onClick={() => setSelectedPr(selectedPr === pr.id ? null : pr.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-[0.1em] border border-[var(--color-border)] rounded-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail</span>
                  </button>
                  {selectedPr !== pr.id && (
                    <>
                      <button 
                        onClick={() => setSelectedPr(pr.id)}
                        className="flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-[0.1em] border border-[var(--color-success)]/30 rounded-sm text-[var(--color-success)] hover:bg-[var(--color-success-muted)] transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Tindak Lanjuti</span>
                      </button>
                    </>
                  )}
                </div>

                {selectedPr === pr.id && (
                  <div className="mt-6 bg-[var(--color-background)] rounded-sm border border-[var(--color-border)] p-6">
                    <div className="mb-4 space-y-2">
                      <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-mono">Item Pengajuan</div>
                      {pr.items.map((item, idx) => {
                        const prod = useStore.getState().produks.find(p => p.id === item.idProduk);
                        return (
                          <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-[var(--color-border)] last:border-0">
                            <div className="flex items-center gap-3">
                              {prod?.gambar ? (
                                <img src={prod.gambar} alt={prod.nama} className="w-8 h-8 object-cover rounded-sm border border-[var(--color-border)]" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-8 h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm flex items-center justify-center text-[8px] text-[var(--color-text-secondary)]">No Img</div>
                              )}
                              <span>{prod?.nama || 'Produk'} (x{item.qty})</span>
                            </div>
                            <span className="text-[var(--color-text-secondary)]">{formatRupiah(item.total)}</span>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-[var(--color-border)] mt-6">
                      <textarea
                        value={catatan}
                        onChange={e => setCatatan(e.target.value)}
                        placeholder="Tambahkan catatan (opsional)..."
                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-3 text-sm focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-text-muted)]"
                        rows={3}
                      />
                      <div className="flex gap-3 justify-end">
                        <button 
                          onClick={() => handleAction(pr.id, 'REJECT')}
                          className="flex items-center gap-1.5 px-5 py-2.5 text-[10px] uppercase tracking-[0.1em] border border-[var(--color-danger)]/30 rounded-sm text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
                        >
                          Tolak
                        </button>
                        <button 
                          onClick={() => handleAction(pr.id, 'APPROVE')}
                          className="flex items-center gap-1.5 px-5 py-2.5 text-[10px] uppercase tracking-[0.1em] bg-[var(--color-success)]/10 border border-[var(--color-success)]/50 rounded-sm text-[var(--color-success)] hover:bg-[var(--color-success)]/20 transition-colors"
                        >
                          Setujui
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
