import { TenderRequest, TenderApplication, create } from 'zustand';
import { TenderRequest, TenderApplication,
  User,
  PTS,
  UnitKerja,
  RKAT,
  Vendor,
  Produk,
  ApprovalConfig,
  PurchaseRequisition,
  PurchaseOrder,
  CartItem,
  KategoriProduk,
  NotificationMsg,
} from '../types';
import { TenderRequest, TenderApplication, initialData } from './initialData';

interface StoreState {
  currentUser: User | null;
  users: User[];
  pts: PTS[];
  units: UnitKerja[];
  rkats: RKAT[];
  vendors: Vendor[];
  produks: Produk[];
  kategories: KategoriProduk[];
  approvalConfigs: ApprovalConfig[];
  prs: PurchaseRequisition[];
  pos: PurchaseOrder[];
  tenders: TenderRequest[];
  addTender: (tender: Omit<TenderRequest, "id" | "createdAt" | "applications" | "status">) => void;
  applyTender: (tenderId: string, application: Omit<TenderApplication, "id" | "createdAt" | "status">) => void;
  approveTenderApplication: (tenderId: string, applicationId: string) => void;
  cart: CartItem[];
  notifications: NotificationMsg[];

  // Actions
  setCurrentUser: (user: User | null) => void;
  addToCart: (produk: Produk, qty: number) => void;
  removeFromCart: (idProduk: string) => void;
  clearCart: () => void;
  
  submitPR: (vendorId: string, items: CartItem[], total: number) => { success: boolean; error?: string; id?: string };
  approvePR: (prId: string, catatan: string) => void;
  rejectPR: (prId: string, catatan: string) => void;
  
  uploadBuktiTransfer: (poId: string) => void;
  updateVendorPOStatus: (poId: string, status: 'PROCESSING' | 'COMPLETED', paymentStatus?: 'PAID') => void;
  
  addNotification: (userId: string, title: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  addProduk: (produk: Omit<Produk, "id">) => void;
  setPts: (pts: PTS[]) => void;
  setVendors: (vendors: Vendor[]) => void;
  setKategories: (kategories: KategoriProduk[]) => void;
  setUsers: (users: User[]) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  currentUser: null,
  users: initialData.users,
  pts: initialData.pts,
  units: initialData.units,
  rkats: initialData.rkats,
  vendors: initialData.vendors,
  produks: initialData.produks,
  kategories: initialData.kategories,
  approvalConfigs: initialData.approvalConfigs,
  prs: initialData.prs,
  pos: initialData.pos,
  tenders: [],
  cart: [],
  notifications: [],

  setPts: (pts) => set({ pts }),
  setVendors: (vendors) => set({ vendors }),
  setKategories: (kategories) => set({ kategories }),
  setUsers: (users) => set({ users }),

  
  addTender: (tender) => set(state => ({
    tenders: [
      ...state.tenders,
      {
        ...tender,
        id: `tender-${Date.now()}`,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        applications: [],
      }
    ]
  })),

  applyTender: (tenderId, appData) => set(state => ({
    tenders: state.tenders.map(t => {
      if (t.id === tenderId) {
        return {
          ...t,
          applications: [
            ...t.applications,
            {
              ...appData,
              id: `app-${Date.now()}`,
              status: 'PENDING',
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    })
  })),

  approveTenderApplication: (tenderId, applicationId) => set(state => ({
    tenders: state.tenders.map(t => {
      if (t.id === tenderId) {
        return {
          ...t,
          status: 'CLOSED',
          applications: t.applications.map(app => ({
            ...app,
            status: app.id === applicationId ? 'APPROVED' : 'REJECTED'
          }))
        };
      }
      return t;
    })
  })),

  setCurrentUser: (user) => set({ currentUser: user }),

  addToCart: (produk, qty) =>
    set((state) => {
      const existing = state.cart.find((item) => item.produk.id === produk.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.produk.id === produk.id ? { ...item, qty: item.qty + qty } : item
          ),
        };
      }
      return { cart: [...state.cart, { produk, qty }] };
    }),

  removeFromCart: (idProduk) =>
    set((state) => ({ cart: state.cart.filter((item) => item.produk.id !== idProduk) })),

  clearCart: () => set({ cart: [] }),

  submitPR: (vendorId, items, total) => {
    const state = get();
    const user = state.currentUser;
    if (!user || user.role !== 'Requisitioner') return { success: false, error: 'Unauthorized' };

    const unit = state.units.find((u) => u.id === user.idUnit);
    const rkat = state.rkats.find((r) => r.idUnit === user.idUnit);

    if (!unit || !rkat) return { success: false, error: 'Data anggaran tidak ditemukan' };

    const sisaPagu = rkat.totalPagu - rkat.paguTerpakai;
    if (total > sisaPagu) {
      return { success: false, error: 'Anggaran tidak mencukupi' };
    }

    // Deduct budget
    set((s) => ({
      rkats: s.rkats.map((r) =>
        r.id === rkat.id ? { ...r, paguTerpakai: r.paguTerpakai + total } : r
      ),
    }));

    // Deduct stock
    set((s) => {
      const newProduks = [...s.produks];
      items.forEach((item) => {
        const idx = newProduks.findIndex((p) => p.id === item.produk.id);
        if (idx !== -1) {
          newProduks[idx] = { ...newProduks[idx], stok: newProduks[idx].stok - item.qty };
        }
      });
      return { produks: newProduks };
    });

    // Create PR
    const newPr: PurchaseRequisition = {
      id: `PR-${Math.floor(Math.random() * 10000)}`,
      idPts: unit.idPts,
      idUnit: unit.id,
      idVendor: vendorId,
      pemohonId: user.id,
      pemohonNama: user.nama,
      totalNominal: total,
      status: 'PENDING_APPROVAL',
      currentApprovalLevel: 1,
      items: items.map((i) => ({
        idProduk: i.produk.id,
        qty: i.qty,
        harga: i.produk.harga,
        total: i.qty * i.produk.harga,
      })),
      catatan: '',
      tanggal: new Date().toISOString(),
      history: [
        {
          id: Math.random().toString(),
          tanggal: new Date().toISOString(),
          actorNama: user.nama,
          actorJabatan: 'Requisitioner',
          action: 'SUBMITTED',
          catatan: 'Pengajuan dibuat',
        },
      ],
    };

    set((s) => ({ prs: [...s.prs, newPr], cart: s.cart.filter(c => c.produk.idVendor !== vendorId) }));
    get().addNotification('admin-01', 'PR Baru', `Pengajuan baru dari ${user.nama} sejumlah ${total}`);
    return { success: true, id: newPr.id };
  },

  approvePR: (prId, catatan) => {
    const state = get();
    const user = state.currentUser;
    if (!user) return;

    set((s) => {
      const pr = s.prs.find((p) => p.id === prId);
      if (!pr) return s;

      const configs = s.approvalConfigs
        .filter((c) => c.idPts === pr.idPts)
        .sort((a, b) => a.levelUrutan - b.levelUrutan);
      
      const currentConfigIndex = configs.findIndex((c) => c.levelUrutan === pr.currentApprovalLevel);
      
      let nextLevel = pr.currentApprovalLevel;
      let newStatus = pr.status;

      // Check if there is a next level config that meets the threshold
      let foundNext = false;
      for (let i = currentConfigIndex + 1; i < configs.length; i++) {
        if (pr.totalNominal >= configs[i].thresholdNominal) {
          nextLevel = configs[i].levelUrutan;
          foundNext = true;
          break;
        }
      }

      if (!foundNext && pr.currentApprovalLevel > 0) { // All approved or no config
        newStatus = 'APPROVED';
      } else if (configs.length === 0 && pr.currentApprovalLevel === 1) {
         // Fallback logic handled implicitly: level 1 is Admin, no next level
         newStatus = 'APPROVED';
      }

      const updatedHistory = [
        ...pr.history,
        {
          id: Math.random().toString(),
          tanggal: new Date().toISOString(),
          actorNama: user.nama,
          actorJabatan: user.jabatan || user.role,
          action: 'APPROVED' as const,
          catatan,
        },
      ];

      const newPrs = s.prs.map((p) =>
        p.id === prId
          ? { ...p, status: newStatus, currentApprovalLevel: nextLevel, history: updatedHistory }
          : p
      );

      return { prs: newPrs };
    });

    // Check if PO needs to be generated
    const updatedPr = get().prs.find(p => p.id === prId);
    if (updatedPr?.status === 'APPROVED') {
      const newPo: PurchaseOrder = {
        id: `PO-${Math.floor(Math.random() * 10000)}`,
        idPr: updatedPr.id,
        nomorPo: `PO/PTS-${updatedPr.idPts.split('-')[1]}/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
        idPts: updatedPr.idPts,
        idVendor: updatedPr.idVendor,
        tanggal: new Date().toISOString(),
        totalNominal: updatedPr.totalNominal,
        statusPo: 'SENT_TO_VENDOR',
        statusPembayaran: 'UNPAID',
      };
      set((s) => ({ pos: [...s.pos, newPo] }));
      get().addNotification(updatedPr.pemohonId, 'PR Disetujui', `Pengajuan ${prId} telah disetujui sepenuhnya.`);
      // Notify vendor
      const vendorUser = get().users.find(u => u.idVendor === updatedPr.idVendor);
      if (vendorUser) {
        get().addNotification(vendorUser.id, 'PO Baru', `Anda menerima PO baru ${newPo.nomorPo}`);
      }
    }
  },

  rejectPR: (prId, catatan) => {
    const state = get();
    const user = state.currentUser;
    if (!user) return;

    set((s) => {
      const pr = s.prs.find((p) => p.id === prId);
      if (!pr) return s;

      // Revert Budget
      const rkat = s.rkats.find(r => r.idUnit === pr.idUnit);
      let newRkats = s.rkats;
      if (rkat) {
        newRkats = s.rkats.map(r => r.id === rkat.id ? { ...r, paguTerpakai: r.paguTerpakai - pr.totalNominal } : r);
      }

      // Revert Stock
      let newProduks = [...s.produks];
      pr.items.forEach(item => {
        const pIdx = newProduks.findIndex(p => p.id === item.idProduk);
        if (pIdx !== -1) {
          newProduks[pIdx] = { ...newProduks[pIdx], stok: newProduks[pIdx].stok + item.qty };
        }
      });

      const updatedHistory = [
        ...pr.history,
        {
          id: Math.random().toString(),
          tanggal: new Date().toISOString(),
          actorNama: user.nama,
          actorJabatan: user.jabatan || user.role,
          action: 'REJECTED' as const,
          catatan,
        },
      ];

      return {
        prs: s.prs.map((p) => p.id === prId ? { ...p, status: 'REJECTED', history: updatedHistory } : p),
        rkats: newRkats,
        produks: newProduks
      };
    });
    
    const pr = get().prs.find(p => p.id === prId);
    if(pr) {
       get().addNotification(pr.pemohonId, 'PR Ditolak', `Pengajuan ${prId} ditolak oleh ${user.nama}.`);
    }
  },

  uploadBuktiTransfer: (poId) => {
    set((s) => ({
      pos: s.pos.map(po => po.id === poId ? { ...po, buktiTransferUrl: 'dummy-receipt.png' } : po)
    }));
  },

  updateVendorPOStatus: (poId, status, paymentStatus) => {
    set((s) => ({
      pos: s.pos.map(po => po.id === poId ? { 
        ...po, 
        statusPo: status, 
        ...(paymentStatus ? { statusPembayaran: paymentStatus } : {}) 
      } : po)
    }));
  },

  addProduk: (produk) => { set((s) => ({ produks: [...s.produks, { ...produk, id: `PROD-${Math.floor(Math.random() * 10000)}` }] })); },

  addNotification: (userId, title, message) => {
    set((s) => ({
      notifications: [{
        id: Math.random().toString(),
        userId,
        title,
        message,
        isRead: false,
        tanggal: new Date().toISOString()
      }, ...s.notifications]
    }));
  },

  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));
  }
}));
