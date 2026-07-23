import { useState } from 'react';
import { useStore } from '../store';
import { Users, Plus, Edit2, Trash2, X } from 'lucide-react';
import { User } from '../types';

export default function UserManagement() {
  const { users, setUsers, pts, vendors } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    nama: '', 
    role: 'Requisitioner',
    jabatan: '',
    afiliasiId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;
    
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      nama: formData.nama,
      role: formData.role as User['role'],
      jabatan: formData.jabatan || undefined,
    };

    if (formData.role === 'AdminKampus' || formData.role === 'Approver' || formData.role === 'Requisitioner') {
      newUser.idPts = formData.afiliasiId || undefined;
    } else if (formData.role === 'Vendor') {
      newUser.idVendor = formData.afiliasiId || undefined;
    }
    
    if (setUsers) {
      setUsers([...users, newUser]);
    }
    
    setIsAddModalOpen(false);
    setFormData({ nama: '', role: 'Requisitioner', jabatan: '', afiliasiId: '' });
  };
  
  return (
    <div className="space-y-6">
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-normal">Tambah Pengguna</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Nama</label>
                <input
                  required
                  type="text"
                  value={formData.nama}
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value, afiliasiId: ''})}
                  className="w-full appearance-none bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="SuperAdmin">SuperAdmin</option>
                  <option value="AdminKampus">AdminKampus</option>
                  <option value="Approver">Approver</option>
                  <option value="Requisitioner">Requisitioner</option>
                  <option value="Vendor">Vendor</option>
                </select>
              </div>
              
              {formData.role !== 'SuperAdmin' && (
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
                    {formData.role === 'Vendor' ? 'Pilih Vendor' : 'Pilih Kampus (PTS)'}
                  </label>
                  <select
                    value={formData.afiliasiId}
                    onChange={e => setFormData({...formData, afiliasiId: e.target.value})}
                    className="w-full appearance-none bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="">-- Pilih Afiliasi --</option>
                    {formData.role === 'Vendor' 
                      ? vendors.map(v => <option key={v.id} value={v.id}>{v.nama}</option>)
                      : pts.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)
                    }
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Jabatan (Opsional)</label>
                <input
                  type="text"
                  value={formData.jabatan}
                  onChange={e => setFormData({...formData, jabatan: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-background)] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)]/90 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">Manajemen Pengguna</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Kelola akses semua pengguna sistem</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-sm text-[10px] uppercase tracking-[0.1em] hover:bg-[var(--color-accent)]/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Pengguna
        </button>
      </div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden hover:border-[var(--color-text-muted)] transition-colors">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-6 py-4 font-normal">Nama / Jabatan</th>
              <th className="px-6 py-4 font-normal">Role</th>
              <th className="px-6 py-4 font-normal">Afiliasi</th>
              <th className="px-6 py-4 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-sm">
            {users.map((user) => {
              const kampus = pts.find(p => p.id === user.idPts);
              const vendor = vendors.find(v => v.id === user.idVendor);
              
              return (
                <tr key={user.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[13px]">{user.nama}</div>
                    {user.jabatan && <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">{user.jabatan}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[11px] uppercase tracking-wide">
                      {kampus?.nama || vendor?.nama || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                      <Edit2 className="w-4 h-4 inline-block" />
                    </button>
                    <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors">
                      <Trash2 className="w-4 h-4 inline-block" />
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
