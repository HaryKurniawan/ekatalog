import { ReactNode } from 'react';
import { useStore } from '../store';
import { Bell, LogOut, Package, Users, LayoutDashboard, ShoppingBag, FileText, CheckSquare, List, ShoppingCart, Building, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function Layout({ children, activeMenu, setActiveMenu }: LayoutProps) {
  const { currentUser, setCurrentUser, notifications, cart } = useStore();

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;

  const menus = getMenusForRole(currentUser.role);

  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-background)] flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-[var(--color-accent)] rounded-sm"></div>
          <span className="text-sm font-medium tracking-[0.2em] uppercase">APTISI V.1</span>
        </div>
        
        <nav className="flex-1 flex flex-col space-y-6 overflow-y-auto">
          <div className="space-y-4 text-[var(--color-text-secondary)] text-xs font-medium tracking-widest uppercase">
            <p className="pl-2">Navigation</p>
            <ul className="space-y-1">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const isActive = activeMenu === menu.id;
              return (
                <li key={menu.id}>
                  <button
                    onClick={() => setActiveMenu(menu.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors normal-case tracking-normal",
                      isActive 
                        ? "text-[var(--color-text-primary)] bg-[var(--color-surface-hover)] border border-[var(--color-border)]" 
                        : "text-[var(--color-text-secondary)] border border-transparent hover:text-[var(--color-text-primary)]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{menu.label}</span>
                    {menu.id === 'cart' && cart.length > 0 && (
                      <span className="ml-auto bg-[var(--color-accent)] text-[var(--color-background)] font-bold text-[10px] px-2 py-0.5 rounded-sm">
                        {cart.length}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            </ul>
          </div>
        </nav>
        
        <div className="pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-center text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
              {currentUser.nama.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-medium truncate">{currentUser.nama}</p>
              <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-tighter truncate">{currentUser.jabatan || currentUser.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-between px-8">
          <h2 className="text-lg font-normal tracking-tight">
            {menus.find(m => m.id === activeMenu)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-success)] rounded-full border border-[var(--color-background)]"></span>
              )}
            </button>
            <button 
              onClick={() => setCurrentUser(null)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded hover:border-[var(--color-text-secondary)] transition-all group"
            >
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)] group-hover:animate-pulse"></div>
              <span className="text-[11px] font-medium tracking-wider uppercase text-[var(--color-text-primary)]">Ganti Peran</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function getMenusForRole(role: string) {
  switch (role) {
    case 'SuperAdmin':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pts', label: 'Daftar Kampus', icon: Building },
        { id: 'vendors', label: 'Kurasi Vendor', icon: Users },
        { id: 'categories', label: 'Kategori Produk', icon: List },
        { id: 'global-transactions', label: 'Transaksi Global', icon: Globe },
        { id: 'users', label: 'Manajemen Pengguna', icon: Users },
      ];
    case 'AdminKampus':
      return [
        { id: 'dashboard', label: 'Dashboard Anggaran', icon: LayoutDashboard },
        { id: 'rkat', label: 'Alokasi RKAT', icon: FileText },
        { id: 'approval-config', label: 'Alur Approval', icon: CheckSquare },
        { id: 'pos', label: 'Purchase Orders', icon: Package },
      ];
    case 'Approver':
      return [
        { id: 'queue', label: 'Antrean Approval', icon: CheckSquare },
        { id: 'history', label: 'Riwayat Keputusan', icon: FileText },
      ];
    case 'Requisitioner':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'catalog', label: 'Katalog Produk', icon: ShoppingBag },
        { id: 'cart', label: 'Keranjang', icon: ShoppingCart },
        { id: 'my-prs', label: 'Pengajuan Saya', icon: FileText },
        { id: 'history', label: 'Riwayat Pengajuan', icon: FileText },
        { id: 'tenders-req', label: 'Permintaan Barang', icon: Package },
      ];
    case 'Vendor':
      return [
        { id: 'dashboard', label: 'Dashboard Vendor', icon: LayoutDashboard },
        { id: 'products', label: 'Kelola Produk', icon: Package },
        { id: 'pos', label: 'Pesanan (PO)', icon: FileText },
        { id: 'tenders-vendor', label: 'Peluang Tender', icon: Globe },
      ];
    default:
      return [];
  }
}
