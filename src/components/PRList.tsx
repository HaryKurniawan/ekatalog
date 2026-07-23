import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function PRList({ type }: { type: 'my-prs' | 'history' }) {
  const { prs, currentUser, users, pts } = useStore();
  
  if (!currentUser) return null;

  let displayPrs = [];
  if (type === 'my-prs') {
    displayPrs = prs.filter(p => p.pemohonId === currentUser.id && p.status === 'PENDING_APPROVAL');
  } else if (type === 'history') {
    if (currentUser.role === 'Requisitioner') {
      displayPrs = prs.filter(p => p.pemohonId === currentUser.id && p.status !== 'PENDING_APPROVAL');
    } else {
      // Show PRs that this approver has acted upon
      displayPrs = prs.filter(p => p.history.some(h => h.actorNama === currentUser.nama && h.actorJabatan === currentUser.jabatan));
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-[var(--color-danger)]" />;
      default: return <Clock className="w-4 h-4 text-[var(--color-warning)]" />;
    }
  };

  const getStatusLabel = (status: string, currentLevel: number) => {
    switch(status) {
      case 'APPROVED': return 'Disetujui';
      case 'REJECTED': return 'Ditolak';
      default: return `Menunggu (Level ${currentLevel})`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">
            {type === 'my-prs' 
              ? 'Pengajuan Saya (Menunggu)' 
              : currentUser.role === 'Requisitioner' 
                ? 'Riwayat Pengajuan' 
                : 'Riwayat Keputusan'}
          </h1>
        </div>
      </div>

      {displayPrs.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-secondary)] text-sm border border-[var(--color-border)] rounded-sm">
          Belum ada data pengajuan.
        </div>
      ) : (
        <div className="space-y-4">
          {displayPrs.map(pr => {
             const pemohon = users.find(u => u.id === pr.pemohonId);
             const kampus = pts.find(p => p.id === pr.idPts);
             
             return (
               <div key={pr.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden group hover:border-[var(--color-text-muted)] transition-colors">
                 <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                   <div>
                     <div className="flex items-center gap-3 mb-2">
                       <span className="font-medium text-sm">{pr.id}</span>
                       <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] bg-[var(--color-background)]">
                         {getStatusIcon(pr.status)}
                         <span>{getStatusLabel(pr.status, pr.currentApprovalLevel)}</span>
                       </div>
                     </div>
                     <div className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wide">
                       Diajukan oleh {pemohon?.nama} ({kampus?.nama}) &bull; {new Date(pr.tanggal).toLocaleDateString()}
                     </div>
                   </div>
                   <div className="text-right">
                     <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">Total</div>
                     <div className="font-normal text-base tracking-tight">{formatRupiah(pr.totalNominal)}</div>
                   </div>
                 </div>

                 {pr.history.length > 0 && (
                   <div className="px-6 py-5 bg-[var(--color-background)] border-t border-[var(--color-border)]">
                     <div className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">Jejak Keputusan</div>
                     <div className="space-y-3">
                       {pr.history.map(h => (
                         <div key={h.id} className="flex gap-3 text-sm">
                           <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)] mt-1.5 flex-shrink-0" />
                           <div>
                             <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                               <span className="font-medium">{h.actorNama}</span>
                               <span className="text-xs text-[var(--color-text-secondary)]">({h.actorJabatan})</span>
                               <span className="text-[10px] text-[var(--color-text-muted)]">{new Date(h.tanggal).toLocaleString()}</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-xs">
                               <span className={h.action === 'APPROVED' ? 'text-[var(--color-success)]' : h.action === 'REJECTED' ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-primary)]'}>
                                 {h.action}
                               </span>
                               {h.catatan && (
                                 <span className="text-[var(--color-text-secondary)]">- "{h.catatan}"</span>
                               )}
                             </div>
                           </div>
                         </div>
                       ))}
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
