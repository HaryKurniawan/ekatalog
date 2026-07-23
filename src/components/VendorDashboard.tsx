import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { FileText, Package, CheckCircle } from 'lucide-react';

export default function VendorDashboard() {
  const { pos, produks, currentUser } = useStore();
  
  const vendorPos = pos.filter(p => p.idVendor === currentUser?.idVendor);
  const vendorProduks = produks.filter(p => p.idVendor === currentUser?.idVendor);

  const totalOmzet = vendorPos.filter(p => p.statusPembayaran === 'PAID').reduce((sum, po) => sum + po.totalNominal, 0);
  const piutang = vendorPos.filter(p => p.statusPembayaran !== 'PAID').reduce((sum, po) => sum + po.totalNominal, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-success-muted)] text-[var(--color-success)] rounded-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Omzet Lunas</div>
              <div className="text-lg font-normal tracking-tight text-[var(--color-text-primary)]">{formatRupiah(totalOmzet)}</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-warning-muted)] text-[var(--color-warning)] rounded-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Piutang Berjalan</div>
              <div className="text-lg font-normal tracking-tight text-[var(--color-warning)]">{formatRupiah(piutang)}</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-accent-muted)] text-[var(--color-accent)] rounded-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Total PO Masuk</div>
              <div className="text-xl font-normal tracking-tight">{vendorPos.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)] rounded-sm">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Total Produk</div>
              <div className="text-xl font-normal tracking-tight">{vendorProduks.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
