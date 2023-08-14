import { v4 as uuidv4 } from 'uuid';
import status from 'http-status';

import fabricClient from '../applications/fabric.js';
import util from '../utils/util.js';
import time from '../utils/time.js';
import transaction from '../utils/transaction-code.js';
import ResponseError from '../errors/response-error.js';
import statusRantaiPasok from '../constant/status-rantai-pasok.js';

import userService from './user-service.js';
import kontrakService from './kontrak-service.js';
import deliveryOrderService from './delivery-order-service.js';
import transaksiItemService from './transaksi-item-service.js';
import pengirimanService from './pengiriman-service.js';
import penerimaanService from './penerimaan-service.js';
import pembayaranService from './pembayaran-service.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
  const deliveryOrder = await deliveryOrderService.findOne(user, request);

  if (deliveryOrder.status !== 'Disetujui') {
    throw new ResponseError(status.BAD_REQUEST, 'Delivery Order belum disetujui');
  }

  if (deliveryOrder.kuantitas < request.kuantitas) {
    throw new ResponseError(status.BAD_REQUEST, 'Kuantitas transaksi melebihi kuantitas delivery order');
  }

  const payload = {
    id: uuidv4(),
    idDeliveryOrder: request.idDeliveryOrder,
    idPetani: user.id,
    nomor: transaction.generateTransactionCode('TRX'),
    tanggalPembuatan: time.getCurrentTime(),
    createdAt: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'TransaksiCreate',
  };

  const transaksi = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const transaksiJSON = JSON.parse(transaksi.toString());

  if (transaksiJSON.status !== status.CREATED) {
    throw new ResponseError(transaksiJSON.status, transaksiJSON.message);
  }

  let transaksiItems = [];
  await Promise.all(
    request.transaksiItems.map(async (transaksiItemRequest) => {
      transaksiItemRequest.idTransaksi = transaksiJSON.data.id;
      const transaksiItem = await transaksiItemService.create(user, transaksiItemRequest);
      transaksiItems.push(transaksiItem);
    })
  );

  transaksiJSON.data.transaksiItems = transaksiItems;

  return transaksiJSON.data;
};

const confirm = async (user, request) => {
  const transaksiPrev = await findOne(user, request);

  if (user.role === util.getAttributeName('koperasi').databaseRoleName) {
    if (transaksiPrev.statusKoperasi === statusRantaiPasok.penawaranTransaksi.disetujui.string) {
      throw new ResponseError(status.BAD_REQUEST, 'Transaksi sudah disetujui oleh Anda');
    }
  }

  if (user.role === util.getAttributeName('pks').databaseRoleName) {
    if (transaksiPrev.statusKoperasi !== statusRantaiPasok.penawaranTransaksi.disetujui.string) {
      throw new ResponseError(status.BAD_REQUEST, 'Transaksi belum disetujui oleh Koperasi');
    }

    if (transaksiPrev.statusPks === statusRantaiPasok.penawaranTransaksi.disetujui.string) {
      throw new ResponseError(status.BAD_REQUEST, 'Transaksi sudah disetujui oleh Anda');
    }
  }

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'TransaksiConfirm',
  };

  const payload = {
    id: request.idTransaksi,
    updatedAt: time.getCurrentTime(),
  };

  if (user.role === util.getAttributeName('koperasi').databaseRoleName) {
    payload.statusKoperasi = request.status;
    payload.pesanKoperasi = request.pesan;
    payload.tanggalKonfirmasiKoperasi = time.getCurrentTime();
    payload.statusPks = -1;
  }

  if (user.role === util.getAttributeName('pks').databaseRoleName) {
    payload.statusPks = request.status;
    payload.pesanPks = request.pesan;
    payload.tanggalKonfirmasiPks = time.getCurrentTime();
    payload.statusKoperasi = -1;
  }

  const transaksi = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const transaksiJSON = JSON.parse(transaksi.toString());

  if (transaksiJSON.status !== status.OK) {
    throw new ResponseError(transaksiJSON.status, transaksiJSON.message);
  }

  const transaksiWithItems = await findOne(user, request);

  if (
    user.role === util.getAttributeName('pks').databaseRoleName &&
    transaksiWithItems.statusPks === statusRantaiPasok.penawaranTransaksi.disetujui.string
  ) {
    const { transaksiItems } = transaksiWithItems;
    const totalKuantitas = transaksiItems.reduce((total, item) => total + item.kuantitas, 0);
    const updateKuantitasKontrakRequest = {
      idKontrak: request.idKontrak,
      kuantitasTerpenuhi: totalKuantitas, // kuantitas ditambah di chaincode
    };

    const updateKuantitasDeliveryOrderRequest = {
      idDeliveryOrder: request.idDeliveryOrder,
      kuantitasTerpenuhi: totalKuantitas, // kuantitas ditambah di chaincode
    };

    await kontrakService.updateKuantitas(user, updateKuantitasKontrakRequest);
    await deliveryOrderService.updateKuantitas(user, updateKuantitasDeliveryOrderRequest);
  }

  transaksiWithItems.idTransaksiBlockchain = transaksiJSON.data.idTransaksiBlockchain;

  return transaksiWithItems;
};

const updateStatus = async (user, request) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'TransaksiUpdateStatus',
  };

  const payload = {
    id: request.idTransaksi,
    status: request.status,
    updatedAt: time.getCurrentTime(),
  };

  const transaksi = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const transaksiJSON = JSON.parse(transaksi.toString());

  if (transaksiJSON.status !== status.OK) {
    throw new ResponseError(transaksiJSON.status, transaksiJSON.message);
  }

  return transaksiJSON.data;
};

const findAll = async (user, request) => {
  await deliveryOrderService.findOne(user, request);

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'TransaksiFindAll',
  };

  const payload = {
    idDeliveryOrder: request.idDeliveryOrder,
  };

  if (user.role === util.getAttributeName('petani').databaseRoleName) {
    payload.idPetani = user.id;
  }

  const result = await fabricClient.evaluateTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  const { data } = resultJSON;
  const petani = await userService.findOne({
    userType: 'petani',
    idAkun: data[0].idPetani,
  });

  const categorizedData = {
    berlangsung: [],
    berhasil: [],
    tidakBerhasil: [],
  };

  await Promise.all(
    data.map(async (transaksi) => {
      const transaksiWithItems = await findOne(user, { ...request, idTransaksi: transaksi.id });
      transaksi.totalKuantitas = transaksiWithItems.totalKuantitas;
      transaksi.totalHarga = transaksiWithItems.totalHarga;
      transaksi.petani = { nama: petani.nama };

      if (transaksi.status === statusRantaiPasok.transaksi.selesai.string) {
        categorizedData.berhasil.push(transaksi);
      } else if (transaksi.status.toLowerCase().split(' ')[0] === 'ditolak') {
        categorizedData.tidakBerhasil.push(transaksi);
      } else {
        categorizedData.berlangsung.push(transaksi);
      }
    })
  );

  categorizedData.berlangsung.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
  categorizedData.berhasil.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
  categorizedData.tidakBerhasil.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));

  return categorizedData;
};

const findOne = async (user, request) => {
  const deliveryOrder = await deliveryOrderService.findOne(user, request);

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'TransaksiFindOne',
  };

  const transaksi = await fabricClient.evaluateTransaction(connection, request.idTransaksi);
  const transaksiJSON = JSON.parse(transaksi.toString());

  if (transaksiJSON.status !== status.OK) {
    throw new ResponseError(transaksiJSON.status, transaksiJSON.message);
  }

  const { data } = transaksiJSON;
  if (user.role === util.getAttributeName('petani').databaseRoleName && data.idPetani !== user.id) {
    throw new ResponseError(status.FORBIDDEN, 'Anda tidak memiliki akses ke transaksi ini');
  }

  const transaksiItems = await transaksiItemService.findAll(user, request);
  data.transaksiItems = transaksiItems;
  data.totalKuantitas = transaksiItems.reduce((total, item) => total + item.kuantitas, 0);
  data.totalHarga = transaksiItems.reduce((total, item) => total + item.kuantitas * item.harga, 0);
  data.hargaDeliveryOrder = deliveryOrder.harga;
  data.totalHargaDeliveryOrder = data.totalKuantitas * data.hargaDeliveryOrder;

  const petani = await userService.findOne({
    userType: 'petani',
    idAkun: data.idPetani,
  });

  data.petani = {
    nama: petani.nama,
    alamat: petani.alamat,
    nomorTelepon: petani.nomorTelepon,
    namaBank: petani.namaBank,
    nomorRekening: petani.nomorRekening,
  };

  data.koperasi = {
    nama: deliveryOrder.koperasi.nama,
    alamat: deliveryOrder.koperasi.alamat,
    nomorTelepon: deliveryOrder.koperasi.nomorTelepon,
    namaBank: deliveryOrder.koperasi.namaBank,
    nomorRekening: deliveryOrder.koperasi.nomorRekening,
  };

  data.pks = {
    nama: deliveryOrder.pks.nama,
    alamat: deliveryOrder.pks.alamat,
    nomorTelepon: deliveryOrder.pks.nomorTelepon,
    namaBank: deliveryOrder.pks.namaBank,
    nomorRekening: deliveryOrder.pks.nomorRekening,
  };

  if (
    data.status === statusRantaiPasok.transaksi.dikirimPetani.string ||
    data.status === statusRantaiPasok.transaksi.dikirimKoperasi.string
  ) {
    const pengiriman = await pengirimanService.findAll(user, request);
    data.pengiriman = pengiriman;
  }

  if (
    data.status === statusRantaiPasok.transaksi.diterimaKoperasi.string ||
    data.status === statusRantaiPasok.transaksi.diterimaPks.string
  ) {
    const pengiriman = await pengirimanService.findAll(user, request);
    data.pengiriman = pengiriman;

    const penerimaan = await penerimaanService.findAll(user, request);
    data.penerimaan = penerimaan;
  }

  if (
    data.status === statusRantaiPasok.transaksi.dibayarPks.string ||
    data.status === statusRantaiPasok.transaksi.dibayarKoperasi.string ||
    data.status === statusRantaiPasok.transaksi.selesai.string
  ) {
    const pengiriman = await pengirimanService.findAll(user, request);
    data.pengiriman = pengiriman;

    const penerimaan = await penerimaanService.findAll(user, request);
    data.penerimaan = penerimaan;

    const pembayaran = await pembayaranService.findAll(user, request);
    data.pembayaran = pembayaran;
  }

  return data;
};

const findAllByUser = async (user) => {
  const deliveryOrder = await deliveryOrderService.findAllByUser(user);
  const transaksi = {
    berlangsung: [],
    berhasil: [],
    tidakBerhasil: [],
  };

  await Promise.all(
    deliveryOrder.map(async (item) => {
      const request = { idKontrak: item.idKontrak, idDeliveryOrder: item.id };
      const result = await findAll(user, request);

      const berlangsung = result.berlangsung.map((val) => {
        val.idKontrak = item.idKontrak;
        return val;
      });

      const berhasil = result.berhasil.map((val) => {
        val.idKontrak = item.idKontrak;
        return val;
      });

      const tidakBerhasil = result.tidakBerhasil.map((val) => {
        val.idKontrak = item.idKontrak;
        return val;
      });

      transaksi.berlangsung.push(...berlangsung);
      transaksi.berhasil.push(...berhasil);
      transaksi.tidakBerhasil.push(...tidakBerhasil);
    })
  );

  return transaksi;
};

const findAllByUserThisWeek = async (user) => {
  const transaksi = await findAllByUser(user);
  const { startOfWeek, endOfWeek } = time.getWeekStartEndDate();
  const transactionsPerDays = {
    senin: [],
    selasa: [],
    rabu: [],
    kamis: [],
    jumat: [],
    sabtu: [],
    minggu: [],
  };

  const transactionBerlangsungThisWeek = transaksi.berlangsung.filter((transaction) => {
    return transaction.updatedAt >= startOfWeek && transaction.updatedAt <= endOfWeek;
  });

  transactionBerlangsungThisWeek.map((transaction) => {
    const day = time.getDayOfDate(transaction.updatedAt);
    transactionsPerDays[day].push(transaction);
  });

  const transactionBerhasilThisWeek = transaksi.berhasil.filter((transaction) => {
    return transaction.updatedAt >= startOfWeek && transaction.updatedAt <= endOfWeek;
  });

  transactionBerhasilThisWeek.map((transaction) => {
    const day = time.getDayOfDate(transaction.updatedAt);
    transactionsPerDays[day].push(transaction);
  });

  const transactionTidakBerhasilThisWeek = transaksi.tidakBerhasil.filter((transaction) => {
    return transaction.updatedAt >= startOfWeek && transaction.updatedAt <= endOfWeek;
  });

  transactionTidakBerhasilThisWeek.map((transaction) => {
    const day = time.getDayOfDate(transaction.updatedAt);
    transactionsPerDays[day].push(transaction);
  });

  return transactionsPerDays;
};

const findAllByUserLaporan = async (user, request) => {
  const transaksi = await findAllByUser(user);

  const { periode } = request;

  const filteredByPeriode = transaksi.berhasil.filter((transaction) => {
    const date = new Date(transaction.updatedAt);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const datePeriode = new Date(periode);
    const monthPeriode = datePeriode.toLocaleString('default', { month: 'long' });
    const yearPeriode = datePeriode.getFullYear();

    return month === monthPeriode && year === yearPeriode;
  });

  const result = [];
  await Promise.all(
    filteredByPeriode.map(async (transaction) => {
      const transactionDetail = await findOne(user, {
        idKontrak: transaction.idKontrak,
        idDeliveryOrder: transaction.idDeliveryOrder,
        idTransaksi: transaction.id,
      });
      result.push(transactionDetail);
    })
  );

  return result;
};

const transaksiService = {
  create,
  confirm,
  updateStatus,
  findAll,
  findOne,
  findAllByUser,
  findAllByUserThisWeek,
  findAllByUserLaporan,
};
export default transaksiService;
