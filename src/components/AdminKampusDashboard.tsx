import { useStore } from '../store';
import { formatRupiah } from '../lib/utils';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function AdminKampusDashboard() {
  const { rkats, units, pts, currentUser } = useStore();
  
  const campusRkats = rkats.filter(r => {
    const unit = units.find(u => u.id === r.idUnit);
    return unit?.idPts === currentUser?.idPts;
  });

  const totalPagu = campusRkats.reduce((sum, r) => sum + r.totalPagu, 0);
  const totalTerpakai = campusRkats.reduce((sum, r) => sum + r.paguTerpakai, 0);
  const sisaPagu = totalPagu - totalTerpakai;

  const pieData = [
    { name: 'Terpakai', value: totalTerpakai, color: '#6E9FFF' },
    { name: 'Sisa Pagu', value: sisaPagu, color: '#2A2A2A' },
  ];

  const barData = campusRkats.map(r => {
    const unit = units.find(u => u.id === r.idUnit);
    return {
      name: unit?.nama || 'Unknown',
      terpakai: r.paguTerpakai,
      sisa: r.totalPagu - r.paguTerpakai
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono mb-3">Total Anggaran RKAT</div>
          <div className="text-2xl font-normal tracking-tight text-[var(--color-text-primary)]">{formatRupiah(totalPagu)}</div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono mb-3">Total Terpakai</div>
          <div className="text-2xl font-normal tracking-tight text-[var(--color-accent)]">{formatRupiah(totalTerpakai)}</div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 hover:border-[var(--color-text-muted)] transition-colors">
          <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono mb-3">Sisa Pagu (Seluruh Unit)</div>
          <div className="text-2xl font-normal tracking-tight text-[var(--color-text-primary)]">{formatRupiah(sisaPagu)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 h-80 flex flex-col hover:border-[var(--color-text-muted)] transition-colors">
          <div className="text-sm font-normal uppercase tracking-wider mb-6 text-[var(--color-text-secondary)]">Penyerapan Anggaran</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatRupiah(value)}
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 h-80 flex flex-col hover:border-[var(--color-text-muted)] transition-colors">
          <div className="text-sm font-normal uppercase tracking-wider mb-6 text-[var(--color-text-secondary)]">Anggaran per Unit Kerja</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} width={120} />
                <Tooltip 
                  formatter={(value: number) => formatRupiah(value)}
                  cursor={{ fill: 'var(--color-surface-hover)' }}
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="terpakai" stackId="a" fill="var(--color-accent)" radius={[0, 0, 0, 0]} name="Terpakai" />
                <Bar dataKey="sisa" stackId="a" fill="#2A2A2A" radius={[0, 4, 4, 0]} name="Sisa Pagu" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden hover:border-[var(--color-text-muted)] transition-colors">
        <div className="px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-background)]">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">Tabel Alokasi Unit Kerja</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              <tr>
                <th className="px-6 py-4 font-normal">Unit Kerja</th>
                <th className="px-6 py-4 font-normal">Total Pagu</th>
                <th className="px-6 py-4 font-normal">Terpakai</th>
                <th className="px-6 py-4 font-normal">Sisa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-sm">
              {campusRkats.map((rkat) => {
                const unit = units.find(u => u.id === rkat.idUnit);
                return (
                  <tr key={rkat.id} className="hover:bg-[var(--color-background)] transition-colors">
                    <td className="px-6 py-4">{unit?.nama}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[var(--color-text-secondary)]">{formatRupiah(rkat.totalPagu)}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[var(--color-accent)]">{formatRupiah(rkat.paguTerpakai)}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[var(--color-text-primary)]">{formatRupiah(rkat.totalPagu - rkat.paguTerpakai)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
