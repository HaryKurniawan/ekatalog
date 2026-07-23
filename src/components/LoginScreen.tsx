import { useState } from 'react';
import { useStore } from '../store';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';

type ViewState = 'login' | 'forgot-password' | 'register';

export default function LoginScreen() {
  const { users, setCurrentUser, vendors, setVendors, setUsers } = useStore();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [view, setView] = useState<ViewState>('login');
  const [vendorRegName, setVendorRegName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleRegisterVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorRegName) return;

    const newVendorId = `vendor-${Date.now().toString().slice(-4)}`;
    const newUserId = `user-v-${Date.now().toString().slice(-4)}`;

    const newVendor = {
      id: newVendorId,
      nama: vendorRegName,
      statusKurasi: 'Pending' as const
    };

    const newUser = {
      id: newUserId,
      nama: `Admin ${vendorRegName}`,
      role: 'Vendor' as const,
      idVendor: newVendorId
    };

    if (setVendors && setUsers) {
      setVendors([...vendors, newVendor]);
      setUsers([...users, newUser]);
      
      alert('Pendaftaran berhasil! Akun Vendor Anda sedang dalam status Pending dan menunggu persetujuan Admin.');
      setView('login');
      setSelectedUserId(newUserId);
    }
  };

  const renderLogin = () => (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="user-select" className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
          Username / Email (Simulasi)
        </label>
        <div className="relative">
          <select
            id="user-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full appearance-none bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
            required
          >
            <option value="" disabled className="text-[var(--color-text-secondary)]">-- Pilih Akun --</option>
            {users.map(user => (
              <option key={user.id} value={user.id} className="bg-[var(--color-background)]">
                {user.nama} ({user.role})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--color-text-secondary)]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
            Password
          </label>
          <button 
            type="button" 
            onClick={() => setView('forgot-password')}
            className="text-[10px] uppercase tracking-widest text-[var(--color-accent)] hover:underline"
          >
            Lupa Password?
          </button>
        </div>
        <input
          id="password"
          type="password"
          value="dummy-password"
          readOnly
          className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none opacity-50 cursor-not-allowed"
        />
        <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">* Password diisi otomatis untuk simulasi</p>
      </div>
      
      <button
        type="submit"
        disabled={!selectedUserId}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Masuk ke Sistem
        <ArrowRight className="w-4 h-4" />
      </button>
      
      <div className="text-center mt-6">
        <p className="text-xs text-[var(--color-text-secondary)]">
          Ingin menjadi Mitra Vendor?{' '}
          <button type="button" onClick={() => setView('register')} className="text-[var(--color-accent)] hover:underline">
            Daftar sebagai Vendor
          </button>
        </p>
      </div>
    </form>
  );

  const renderForgotPassword = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-lg font-normal mb-2">Lupa Password</h2>
        <p className="text-[12px] text-[var(--color-text-secondary)]">Masukkan email Anda untuk menerima tautan reset password.</p>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Email</label>
        <input
          type="email"
          placeholder="email@institusi.ac.id"
          className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          alert('Simulasi: Tautan reset password telah dikirim!');
          setView('login');
        }}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)]/90 transition-colors"
      >
        Kirim Tautan Reset
      </button>
      <div className="text-center mt-6">
        <button type="button" onClick={() => setView('login')} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Kembali ke Login
        </button>
      </div>
    </div>
  );

  const renderRegister = () => (
    <form onSubmit={handleRegisterVendor} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-lg font-normal mb-2">Pendaftaran Vendor</h2>
        <p className="text-[12px] text-[var(--color-text-secondary)]">Daftarkan perusahaan Anda untuk menjadi mitra penyedia di e-Katalog APTISI.</p>
      </div>
      
      <div className="space-y-2">
        <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">Nama Perusahaan / Vendor</label>
        <input
          required
          type="text"
          placeholder="PT Mitra Jaya..."
          value={vendorRegName}
          onChange={(e) => setVendorRegName(e.target.value)}
          className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        />
      </div>
      
      <button
        type="submit"
        disabled={!vendorRegName}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.1em] rounded-sm hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Kirim Pendaftaran
      </button>
      
      <div className="text-center mt-6">
        <button type="button" onClick={() => setView('login')} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Kembali ke Login
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--color-background)]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] mb-6 text-[var(--color-accent)] shadow-[0_0_15px_rgba(110,159,255,0.05)]">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-normal tracking-tight">Simulasi Login e-Katalog APTISI</h1>
          </div>
          
          {view === 'login' && renderLogin()}
          {view === 'forgot-password' && renderForgotPassword()}
          {view === 'register' && renderRegister()}
        </div>
      </div>
    </div>
  );
}
