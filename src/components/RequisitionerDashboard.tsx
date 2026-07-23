import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function RequisitionerDashboard() {
  const { currentUser, units, rkats, prs } = useStore();
  
  const unit = units.find(u => u.id === currentUser?.idUnit);
  const rkat = rkats.find(r => r.idUnit === currentUser?.idUnit);
  const myPrs = prs.filter(p => p.pemohonId === currentUser?.id);
  
  const totalPr = myPrs.length;
  const approvedPr = myPrs.filter(p => p.status === 'APPROVED').length;
  const pendingPr = myPrs.filter(p => p.status === 'PENDING_APPROVAL').length;
  const rejectedPr = myPrs.filter(p => p.status === 'REJECTED').length;

  const sisaPagu = rkat ? rkat.totalPagu - rkat.paguTerpakai : 0;
  const persentaseTerpakai = rkat ? Math.round((rkat.paguTerpakai / rkat.totalPagu) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 flex items-center justify-between hover:border-[#444] transition-colors">
        <div className="space-y-1">
          <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.15em] font-medium">Informasi Pagu Anggaran Unit</p>
          <p className="text-xl font-normal">{unit?.nama || 'Unit Kerja'}</p>
        </div>
        <div className="w-72 space-y-2 hidden sm:block">
          <div className="flex justify-between text-[11px] text-[var(--color-text-secondary)] tracking-wider uppercase">
            <span>Sisa Pagu: {formatRupiah(sisaPagu)}</span>
            <span>{100 - persentaseTerpakai}% Sisa</span>
          </div>
          <div className="h-[2px] bg-[var(--color-border)] w-full rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-success)]" style={{ width: `${100 - persentaseTerpakai}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[#444] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Total Pengajuan</div>
              <div className="text-xl font-normal tracking-tight">{totalPr}</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[#444] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-sm">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Disetujui</div>
              <div className="text-xl font-normal tracking-tight">{approvedPr}</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[#444] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-warning)]/10 text-[var(--color-warning)] rounded-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Menunggu</div>
              <div className="text-xl font-normal tracking-tight">{pendingPr}</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[#444] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-danger)]/10 text-[var(--color-danger)] rounded-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Ditolak</div>
              <div className="text-xl font-normal tracking-tight">{rejectedPr}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
