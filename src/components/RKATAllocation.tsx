import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { Edit2 } from 'lucide-react';

export default function RKATAllocation() {
  const { rkats, units, currentUser } = useStore();
  
  const campusRkats = rkats.filter(r => {
    const unit = units.find(u => u.id === r.idUnit);
    return unit?.idPts === currentUser?.idPts;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">Alokasi RKAT</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Kelola pagu anggaran per unit kerja</p>
        </div>
      </div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-6 py-4 font-normal">Tahun</th>
              <th className="px-6 py-4 font-normal">Unit Kerja</th>
              <th className="px-6 py-4 font-normal">Total Pagu</th>
              <th className="px-6 py-4 font-normal">Terpakai</th>
              <th className="px-6 py-4 font-normal">Sisa</th>
              <th className="px-6 py-4 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-sm">
            {campusRkats.map((rkat) => {
              const unit = units.find(u => u.id === rkat.idUnit);
              return (
                <tr key={rkat.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4 text-[11px] font-mono text-[var(--color-text-secondary)]">{rkat.tahun}</td>
                  <td className="px-6 py-4">{unit?.nama}</td>
                  <td className="px-6 py-4 font-mono text-[11px] text-[var(--color-text-secondary)]">{formatRupiah(rkat.totalPagu)}</td>
                  <td className="px-6 py-4 font-mono text-[11px] text-[var(--color-danger)]">{formatRupiah(rkat.paguTerpakai)}</td>
                  <td className="px-6 py-4 font-mono text-[11px] text-[var(--color-text-primary)]">{formatRupiah(rkat.totalPagu - rkat.paguTerpakai)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                      <Edit2 className="w-4 h-4 inline-block" />
                    </button>
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
