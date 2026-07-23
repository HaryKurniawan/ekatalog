import { useState } from 'react';
import { useStore } from '../store';
import { Plus, X, Eye, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function TenderRequisitioner() {
  const { tenders, currentUser, addTender, approveTenderApplication, vendors, kategories } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingTenderId, setViewingTenderId] = useState<string | null>(null);
  const [isLainnya, setIsLainnya] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    kategori: '',
    spesifikasi: '',
    jumlah: 1,
    paymentTerms: 'FULL_100',
    targetDate: '',
  });

  if (!currentUser || currentUser.role !== 'Requisitioner') return null;

  const myTenders = tenders.filter(t => t.pemohonId === currentUser.id);
  const viewingTender = tenders.find(t => t.id === viewingTenderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    addTender({
      pemohonId: currentUser.id,
      idPts: currentUser.idPts || '',
      title: formData.title,
      description: formData.description,
      kategori: formData.kategori,
      spesifikasi: formData.spesifikasi,
      jumlah: Number(formData.jumlah),
      paymentTerms: formData.paymentTerms as 'DP_25' | 'DP_50' | 'FULL_100',
      targetDate: formData.targetDate
    });
    
    setIsAddModalOpen(false);
    setIsLainnya(false);
    setFormData({ title: '', description: '', kategori: '', spesifikasi: '', jumlah: 1, paymentTerms: 'FULL_100', targetDate: '' });
  };

  return (
    <div className="space-y-6">
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] shrink-0">
              <h2 className="text-lg font-normal">Buat Permintaan Barang (Tender)</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Judul Kebutuhan</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Pengadaan 50 Unit Laptop Core i7"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Kategori Barang</label>
                <select
                  required
                  value={isLainnya ? 'Lainnya' : formData.kategori}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'Lainnya') {
                      setIsLainnya(true);
                      setFormData({...formData, kategori: ''});
                    } else {
                      setIsLainnya(false);
                      setFormData({...formData, kategori: val});
                    }
                  }}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {kategories.map(k => (
                    <option key={k.id} value={k.nama}>{k.nama}</option>
                  ))}
                  <option value="Lainnya">Lainnya (Ketik Sendiri)</option>
                </select>
                {isLainnya && (
                  <input
                    required
                    type="text"
                    placeholder="Masukkan kategori baru..."
                    value={formData.kategori}
                    onChange={e => setFormData({...formData, kategori: e.target.value})}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)] mt-2"
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Spesifikasi Lengkap</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: RAM 16GB, SSD 512GB, Layar 14 inch, Garansi 2 tahun..."
                  value={formData.spesifikasi}
                  onChange={e => setFormData({...formData, spesifikasi: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)] resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Deskripsi Tambahan</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Tujuan pengadaan, catatan pengiriman..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)] resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Jumlah (Qty)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.jumlah}
                  onChange={e => setFormData({...formData, jumlah: Number(e.target.value)})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Mekanisme Pembayaran</label>
                <select
                  required
                  value={formData.paymentTerms}
                  onChange={e => setFormData({...formData, paymentTerms: e.target.value})}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="FULL_100">Lunas 100%</option>
                  <option value="DP_50">DP 50%</option>
                  <option value="DP_25">DP 25%</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Target Waktu Pemenuhan</label>
                <input
                  required
                  type="date"
                  value={formData.targetDate}
                  onChange={e => setFormData({...formData, targetDate: e.target.value})}
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
                  Ajukan Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingTenderId && viewingTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-lg font-normal">{viewingTender.title}</h2>
                <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Status: {viewingTender.status}</div>
              </div>
              <button 
                onClick={() => setViewingTenderId(null)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-8 space-y-4 p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm">
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Kategori Barang</h3>
                  <p className="text-sm">{viewingTender.kategori}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Jumlah (Qty)</h3>
                  <p className="text-sm">{viewingTender.jumlah}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Mekanisme Pembayaran</h3>
                  <p className="text-sm font-medium">
                    {viewingTender.paymentTerms === 'DP_25' ? 'DP 25%' : 
                     viewingTender.paymentTerms === 'DP_50' ? 'DP 50%' : 
                     'Lunas 100%'}
                  </p>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Spesifikasi Lengkap</h3>
                  <p className="text-sm whitespace-pre-wrap">{viewingTender.spesifikasi}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Deskripsi Tambahan</h3>
                  <p className="text-sm whitespace-pre-wrap">{viewingTender.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
                  Target: {new Date(viewingTender.targetDate).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-sm font-medium mb-4">Penawaran Vendor ({viewingTender.applications.length})</h3>
              
              {viewingTender.applications.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-text-secondary)] text-sm border border-[var(--color-border)] rounded-sm border-dashed">
                  Belum ada vendor yang mengajukan penawaran.
                </div>
              ) : (
                <div className="space-y-4">
                  {viewingTender.applications.map(app => {
                    const vendor = vendors.find(v => v.id === app.vendorId);
                    return (
                      <div key={app.id} className={`p-4 border rounded-sm transition-colors ${app.status === 'APPROVED' ? 'border-[var(--color-success)] bg-[var(--color-success-muted)]' : 'border-[var(--color-border)] bg-[var(--color-background)]'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">{vendor?.nama || app.vendorId}</div>
                            <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">{new Date(app.createdAt).toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-medium text-lg">
                              Rp {app.price.toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] mt-0.5">Penawaran Harga</div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-[var(--color-text-secondary)] bg-[var(--color-surface)] p-3 rounded-sm border border-[var(--color-border)] mb-4">
                          {app.proposal}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest border ${
                            app.status === 'APPROVED' ? 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]/20' :
                            app.status === 'REJECTED' ? 'bg-[var(--color-danger-muted)] text-[var(--color-danger)] border-[var(--color-danger)]/20' :
                            'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[var(--color-warning)]/20'
                          }`}>
                            {app.status === 'APPROVED' ? <CheckCircle2 className="w-3 h-3" /> : app.status === 'REJECTED' ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {app.status}
                          </span>
                          
                          {viewingTender.status === 'OPEN' && app.status === 'PENDING' && (
                            <button
                              onClick={() => {
                                if (confirm('Apakah Anda yakin ingin menyetujui penawaran ini? Tindakan ini akan menutup tender.')) {
                                  approveTenderApplication(viewingTender.id, app.id);
                                }
                              }}
                              className="px-4 py-2 bg-[var(--color-success)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-success)]/90 transition-colors"
                            >
                              Pilih Penawaran
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-normal tracking-tight">Permintaan Barang (Tender)</h1>
          <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Ajukan kebutuhan yang tidak ada di katalog</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-sm text-[10px] uppercase tracking-[0.1em] hover:bg-[var(--color-accent)]/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Buat Permintaan
        </button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden hover:border-[#444] transition-colors">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-6 py-4 font-normal">Judul Kebutuhan</th>
              <th className="px-6 py-4 font-normal">Target Waktu</th>
              <th className="px-6 py-4 font-normal">Penawaran</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-sm">
            {myTenders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-[var(--color-text-secondary)]">
                  Anda belum membuat permintaan barang apapun.
                </td>
              </tr>
            ) : (
              myTenders.map(tender => (
                <tr key={tender.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-medium truncate max-w-[200px]">{tender.title}</div>
                    <div className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">{new Date(tender.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px]">{new Date(tender.targetDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-sm bg-[var(--color-background)] border border-[var(--color-border)] text-xs">
                      {tender.applications.length}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest border ${
                      tender.status === 'OPEN' ? 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]/20' :
                      'bg-[var(--color-background)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
                    }`}>
                      {tender.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setViewingTenderId(tender.id)}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Eye className="w-4 h-4 inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
