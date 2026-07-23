import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';

export default function ApprovalConfigManager() {
  const { approvalConfigs, currentUser } = useStore();
  
  const campusConfigs = approvalConfigs.filter(c => c.idPts === currentUser?.idPts).sort((a, b) => a.levelUrutan - b.levelUrutan);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">Alur Approval</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Konfigurasi persetujuan berjenjang</p>
        </div>
      </div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[var(--color-border)]">
          {campusConfigs.map((config, idx) => (
            <div key={config.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[10px] font-mono text-[var(--color-text-secondary)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {config.levelUrutan}
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-5 rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-text-muted)] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-normal text-[var(--color-accent)]">{config.roleApprover}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 rounded-sm">Level {config.levelUrutan}</div>
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest">Minimal Belanja</div>
                <div className="font-mono text-sm tracking-tight text-[var(--color-text-primary)] mt-1">{formatRupiah(config.thresholdNominal)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
