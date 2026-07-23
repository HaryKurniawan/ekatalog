export type Role =
  | 'SuperAdmin'
  | 'AdminKampus'
  | 'Approver'
  | 'Requisitioner'
  | 'Vendor';

export interface User {
  id: string;
  nama: string;
  role: Role;
  jabatan?: string; // e.g., 'Kaprodi', 'Dekan', 'Rektor'
  idPts?: string;
  idUnit?: string;
  idVendor?: string;
}

export interface PTS {
  id: string;
  nama: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface UnitKerja {
  id: string;
  idPts: string;
  nama: string;
}

export interface RKAT {
  id: string;
  idUnit: string;
  tahun: number;
  totalPagu: number;
  paguTerpakai: number;
}

export interface Vendor {
  id: string;
  nama: string;
  statusKurasi: 'Pending' | 'Approved' | 'Rejected';
}

export interface KategoriProduk {
  id: string;
  nama: string;
}

export interface Produk {
  id: string;
  idVendor: string;
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
  gambar?: string;
}

export interface ApprovalConfig {
  id: string;
  idPts: string;
  thresholdNominal: number;
  levelUrutan: number; // 1, 2, 3...
  roleApprover: string; // matches User.jabatan
}

export interface PRItem {
  idProduk: string;
  qty: number;
  harga: number;
  total: number;
}

export interface PurchaseRequisition {
  id: string;
  idPts: string;
  idUnit: string;
  idVendor: string; // Added to strictly link PR to 1 vendor
  pemohonId: string;
  pemohonNama: string;
  totalNominal: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  currentApprovalLevel: number;
  items: PRItem[];
  catatan: string;
  history: PRHistory[];
  tanggal: string;
}

export interface PRHistory {
  id: string;
  tanggal: string;
  actorNama: string;
  actorJabatan: string;
  action: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  catatan: string;
}

export interface PurchaseOrder {
  id: string;
  idPr: string;
  nomorPo: string;
  idPts: string;
  idVendor: string;
  tanggal: string;
  totalNominal: number;
  statusPo: 'SENT_TO_VENDOR' | 'PROCESSING' | 'COMPLETED';
  statusPembayaran: 'UNPAID' | 'PARTIAL' | 'PAID';
  buktiTransferUrl?: string;
}

export interface CartItem {
  produk: Produk;
  qty: number;
}

export interface NotificationMsg {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  tanggal: string;
}

export interface TenderApplication {
  id: string;
  vendorId: string;
  tenderId: string;
  proposal: string;
  price: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface TenderRequest {
  id: string;
  pemohonId: string;
  idPts: string;
  title: string;
  description: string;
  kategori: string;
  spesifikasi: string;
  jumlah: number;
  paymentTerms: 'DP_25' | 'DP_50' | 'FULL_100';
  targetDate: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  applications: TenderApplication[];
}
