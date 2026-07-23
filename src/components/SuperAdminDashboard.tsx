import { useStore } from '../store';
import { Users, LayoutDashboard, Truck, Package } from 'lucide-react';

export default function SuperAdminDashboard() {
  const { pts, vendors, produks } = useStore();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-accent-muted)] text-[var(--color-accent)] rounded-sm">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Total PTS Aktif</div>
              <div className="text-2xl font-normal tracking-tight">{pts.length} Kampus</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-success-muted)] text-[var(--color-success)] rounded-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Vendor Terkurasi</div>
              <div className="text-2xl font-normal tracking-tight">{vendors.filter(v => v.statusKurasi === 'Approved').length} Vendor</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--color-warning-muted)] text-[var(--color-warning)] rounded-sm">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Produk Nasional</div>
              <div className="text-2xl font-normal tracking-tight">{produks.length} Item</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
