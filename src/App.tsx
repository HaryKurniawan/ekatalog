import { useState, useEffect } from 'react';
import { useStore } from './store';
import LoginScreen from './components/LoginScreen';
import Layout from './components/Layout';
import RequisitionerCatalog from './components/RequisitionerCatalog';
import RequisitionerCart from './components/RequisitionerCart';
import ApproverQueue from './components/ApproverQueue';
import AdminKampusDashboard from './components/AdminKampusDashboard';
import PODetail from './components/PODetail';
import PRList from './components/PRList';
import TenderRequisitioner from "./components/TenderRequisitioner";
import TenderVendor from "./components/TenderVendor";
import SuperAdminDashboard from './components/SuperAdminDashboard';
import RequisitionerDashboard from './components/RequisitionerDashboard';
import CampusList from './components/CampusList';
import GlobalTransactions from './components/GlobalTransactions';
import UserManagement from './components/UserManagement';
import VendorList from './components/VendorList';
import CategoryList from './components/CategoryList';
import RKATAllocation from './components/RKATAllocation';
import ApprovalConfigManager from './components/ApprovalConfigManager';
import VendorDashboard from './components/VendorDashboard';
import ProductManager from './components/ProductManager';
import { formatRupiah } from './lib/utils';
import { FileText } from 'lucide-react';

function DashboardPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 border border-[var(--color-border)] bg-[var(--color-surface)] rounded-sm text-[var(--color-text-secondary)]">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-[10px] uppercase tracking-widest mt-2">(Dalam Pengembangan)</div>
    </div>
  );
}

function POList({ role }: { role: string }) {
  const { pos, pts, vendors, currentUser } = useStore();
  const [selectedPo, setSelectedPo] = useState<string | null>(null);

  if (selectedPo) {
    return <PODetail poId={selectedPo} onBack={() => setSelectedPo(null)} />;
  }

  let visiblePos = pos;
  if (role === 'AdminKampus') {
    visiblePos = pos.filter(p => p.idPts === currentUser?.idPts);
  } else if (role === 'Vendor') {
    visiblePos = pos.filter(p => p.idVendor === currentUser?.idVendor);
  }

  return (
    <div className="space-y-4">
      {visiblePos.length === 0 ? (
        <DashboardPlaceholder title="Belum ada Purchase Order" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visiblePos.map(po => {
             const vendor = vendors.find(v => v.id === po.idVendor);
             const kampus = pts.find(p => p.id === po.idPts);
             return (
               <div key={po.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[var(--color-text-muted)] transition-colors">
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                     <span className="font-normal text-sm">{po.nomorPo}</span>
                     <span className="text-[10px] px-2 py-0.5 rounded-sm border border-[var(--color-border)] uppercase tracking-widest text-[var(--color-text-secondary)] bg-[var(--color-background)]">{po.statusPo}</span>
                   </div>
                   <div className="text-[11px] uppercase tracking-wide text-[var(--color-text-secondary)]">
                     {role === 'Vendor' ? `Pemesan: ${kampus?.nama}` : `Vendor: ${vendor?.nama}`}
                   </div>
                 </div>
                 <div className="flex items-center gap-8">
                   <div className="text-right">
                     <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Total</div>
                     <div className="font-normal text-base">{formatRupiah(po.totalNominal)}</div>
                   </div>
                   <button 
                     onClick={() => setSelectedPo(po.id)}
                     className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-sm text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-colors"
                   >
                     <FileText className="w-3.5 h-3.5" />
                     <span>Detail</span>
                   </button>
                 </div>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
}

function MainRouter({ activeMenu }: { activeMenu: string }) {
  const { currentUser } = useStore();
  
  if (!currentUser) return null;

  switch (activeMenu) {
    case 'catalog': return <RequisitionerCatalog />;
    case 'cart': return <RequisitionerCart />;
    case 'queue': return <ApproverQueue />;
    case 'my-prs': return <PRList type="my-prs" />;
    case 'history': return <PRList type="history" />;
    case 'tenders-req': return <TenderRequisitioner />;
    case 'tenders-vendor': return <TenderVendor />;
    case 'history': return <PRList type="history" />;
    case 'tenders-req': return <TenderRequisitioner />;
    case 'tenders-vendor': return <TenderVendor />;
    case 'vendors': return <VendorList />;
    case 'categories': return <CategoryList />;
    case 'rkat': return <RKATAllocation />;
    case 'approval-config': return <ApprovalConfigManager />;
    case 'products': return <ProductManager />;
    case 'pts': return <CampusList />;
    case 'global-transactions': return <GlobalTransactions />;
    case 'users': return <UserManagement />;
    case 'dashboard':
      if (currentUser.role === 'SuperAdmin') return <SuperAdminDashboard />;
      if (currentUser.role === 'AdminKampus') return <AdminKampusDashboard />;
      if (currentUser.role === 'Vendor') return <VendorDashboard />;
      if (currentUser.role === 'Requisitioner') return <RequisitionerDashboard />;
      return <DashboardPlaceholder title={`Dashboard ${currentUser.role}`} />;
    case 'pos': return <POList role={currentUser.role} />;
    default: return <DashboardPlaceholder title={activeMenu} />;
  }
}



export default function App() {
  const { currentUser } = useStore();
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  useEffect(() => {
    if (currentUser) {
       if (currentUser.role === 'Requisitioner') setActiveMenu('catalog');
       else if (currentUser.role === 'Approver') setActiveMenu('queue');
       else setActiveMenu('dashboard');
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <Layout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
      <MainRouter activeMenu={activeMenu} />
    </Layout>
  );
}
