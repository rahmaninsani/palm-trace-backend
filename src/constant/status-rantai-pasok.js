const penawaranKontrak = {
  menungguKonfirmasi: {
    number: 0,
    string: 'Menunggu Konfirmasi',
  },
  disetujui: {
    number: 1,
    string: 'Disetujui',
  },
  ditolak: {
    number: 2,
    string: 'Ditolak',
  },
};

const penawaranDeliverOrder = {
  menungguKonfirmasi: {
    number: 0,
    string: 'Menunggu Konfirmasi',
  },
  disetujui: {
    number: 1,
    string: 'Disetujui',
  },
  ditolak: {
    number: 2,
    string: 'Ditolak',
  },
};

const penawaranTransaksi = {
  menungguKonfirmasi: {
    number: 0,
    string: 'Menunggu Konfirmasi',
  },
  disetujui: {
    number: 1,
    string: 'Disetujui',
  },
  ditolak: {
    number: 2,
    string: 'Ditolak',
  },
};

const transaksi = {
  menungguDikirimPetani: {
    number: 6,
    string: 'Menunggu Dikirim Petani',
  },
  dikirimPetani: {
    number: 7,
    string: 'Dikirim Petani',
  },
  diterimaKoperasi: {
    number: 8,
    string: 'Diterima Koperasi',
  },
  dikirimKoperasi: {
    number: 9,
    string: 'Dikirim Koperasi',
  },
  diterimaPks: {
    number: 10,
    string: 'Diterima Pabrik Kelapa Sawit',
  },
  dibayarPks: {
    number: 11,
    string: 'Dibayar Pabrik Kelapa Sawit',
  },
  dibayarKoperasi: {
    number: 12,
    string: 'Dibayar Koperasi',
  },
  seleseai: {
    number: 13,
    string: 'Selesai',
  },
};

const statusRantaiPasok = {
  penawaranKontrak,
  penawaranDeliverOrder,
  penawaranTransaksi,
  transaksi,
};

export default statusRantaiPasok;
