import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { Globe } from 'lucide-react';

export default function GlobalTransactions() {
  const { pos, pts, vendors } = useStore();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">Transaksi Global</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Pantau seluruh Purchase Order secara nasional</p>
        </div>
      </div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden hover:border-[#444] transition-colors">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-6 py-4 font-normal">No. PO & Tanggal</th>
              <th className="px-6 py-4 font-normal">Kampus / Vendor</th>
              <th className="px-6 py-4 font-normal">Nominal</th>
              <th className="px-6 py-4 font-normal">Status PO</th>
              <th className="px-6 py-4 font-normal">Status Pembayaran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-sm">
            {pos.map((po) => {
              const kampus = pts.find(p => p.id === po.idPts);
              const vendor = vendors.find(v => v.id === po.idVendor);
              
              return (
                <tr key={po.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[13px]">{po.nomorPo}</div>
                    <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">
                      {new Date(po.tanggal).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[11px] uppercase tracking-wide">{kampus?.nama}</div>
                    <div className="text-[11px] uppercase tracking-wide text-[var(--color-text-secondary)] mt-1">{vendor?.nama}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-[var(--color-text-primary)]">
                    {formatRupiah(po.totalNominal)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                      {po.statusPo.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest border ${
                      po.statusPembayaran === 'PAID' ? 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]/20' :
                      'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[var(--color-warning)]/20'
                    }`}>
                      {po.statusPembayaran === 'PAID' ? 'LUNAS' : 'BELUM DIBAYAR'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
