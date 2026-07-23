import { User, PTS, UnitKerja, RKAT, Vendor, Produk, KategoriProduk, ApprovalConfig, PurchaseRequisition, PurchaseOrder } from '../types';

const users: User[] = [
  { id: 'sa-01', nama: 'Budi (Super Admin APTISI)', role: 'SuperAdmin' },
  { id: 'admin-01', nama: 'Siti (Admin Kampus)', role: 'AdminKampus', idPts: 'pts-01' },
  { id: 'app-01', nama: 'Dr. Andi (Kaprodi)', role: 'Approver', jabatan: 'Kaprodi', idPts: 'pts-01', idUnit: 'unit-01' },
  { id: 'app-02', nama: 'Prof. Sari (Dekan)', role: 'Approver', jabatan: 'Dekan', idPts: 'pts-01', idUnit: 'unit-01' },
  { id: 'app-03', nama: 'Dr. Budi (Rektor)', role: 'Approver', jabatan: 'Rektor', idPts: 'pts-01' },
  { id: 'req-01', nama: 'Joko (Dosen/Staf)', role: 'Requisitioner', idPts: 'pts-01', idUnit: 'unit-01' },
  { id: 'ven-01', nama: 'Admin PT Sumber Ilmu', role: 'Vendor', idVendor: 'vendor-01' },
  { id: 'ven-02', nama: 'Admin CV Abadi Jaya', role: 'Vendor', idVendor: 'vendor-02' },
];

const pts: PTS[] = [
  { id: 'pts-01', nama: 'Universitas Merdeka', status: 'Aktif' },
];

const units: UnitKerja[] = [
  { id: 'unit-01', idPts: 'pts-01', nama: 'Prodi Teknik Informatika' },
  { id: 'unit-02', idPts: 'pts-01', nama: 'Prodi Sistem Informasi' },
];

const rkats: RKAT[] = [
  { id: 'rkat-01', idUnit: 'unit-01', tahun: 2026, totalPagu: 150000000, paguTerpakai: 20000000 },
  { id: 'rkat-02', idUnit: 'unit-02', tahun: 2026, totalPagu: 100000000, paguTerpakai: 0 },
];

const vendors: Vendor[] = [
  { id: 'vendor-01', nama: 'PT Sumber Ilmu', statusKurasi: 'Approved' },
  { id: 'vendor-02', nama: 'CV Abadi Jaya', statusKurasi: 'Approved' },
  { id: 'vendor-03', nama: 'Toko Tiga Saudara', statusKurasi: 'Pending' },
];

const kategories: KategoriProduk[] = [
  { id: 'cat-01', nama: 'IT Equipment' },
  { id: 'cat-02', nama: 'Alat Lab' },
  { id: 'cat-03', nama: 'ATK' },
];

const produks: Produk[] = [
  { id: 'prod-01', idVendor: 'vendor-01', nama: 'Laptop Dosen i5', harga: 12500000, stok: 10, kategori: 'cat-01', gambar: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
  { id: 'prod-02', idVendor: 'vendor-01', nama: 'Proyektor Ruang Kelas', harga: 5000000, stok: 5, kategori: 'cat-01', gambar: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
  { id: 'prod-03', idVendor: 'vendor-02', nama: 'Mikroskop Binokuler', harga: 8500000, stok: 12, kategori: 'cat-02', gambar: 'https://images.unsplash.com/photo-1582719478250-c8940acebacd?w=500&q=80' },
  { id: 'prod-04', idVendor: 'vendor-02', nama: 'Kertas HVS A4 (1 Dus)', harga: 250000, stok: 100, kategori: 'cat-03', gambar: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80' },
];

const approvalConfigs: ApprovalConfig[] = [
  { id: 'cfg-01', idPts: 'pts-01', thresholdNominal: 0, levelUrutan: 1, roleApprover: 'Kaprodi' },
  { id: 'cfg-02', idPts: 'pts-01', thresholdNominal: 10000000, levelUrutan: 2, roleApprover: 'Dekan' },
  { id: 'cfg-03', idPts: 'pts-01', thresholdNominal: 50000000, levelUrutan: 3, roleApprover: 'Rektor' },
];

const prs: PurchaseRequisition[] = [
  {
    id: 'PR-1001',
    idPts: 'pts-01',
    idUnit: 'unit-01',
    idVendor: 'vendor-01',
    pemohonId: 'req-01',
    pemohonNama: 'Joko (Dosen/Staf)',
    totalNominal: 12500000,
    status: 'PENDING_APPROVAL',
    currentApprovalLevel: 1,
    items: [
      { idProduk: 'prod-01', qty: 1, harga: 12500000, total: 12500000 }
    ],
    catatan: 'Untuk dosen baru',
    history: [],
    tanggal: new Date().toISOString()
  }
];

const pos: PurchaseOrder[] = [];

export const initialData = {
  users, pts, units, rkats, vendors, produks, kategories, approvalConfigs, prs, pos
};
