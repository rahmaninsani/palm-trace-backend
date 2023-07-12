import transaksiService from '../services/transaksi-service.js';

const create = async (req, res, next) => {
  try {
    const request = {
      organizationName: 'Petani',
      channelName: 'transaksi-channel',
      chaincodeName: 'transaksi-chaincode',
      transactionName: 'CreateAsset',
      values: [
        'K0006',
        'D0006',
        'TRX0006',
        'PKS',
        'Koperasi',
        'Petani',
        '1000',
        '2100',
        '2023-06-07',
        '2023-06-07',
        'Selesai',
      ],
      wallet: req.app.locals.wallet,
    };

    // const result = await transaksiService.submit(request);

    res.status(200).json({
      data: 'OK',
    });
  } catch (error) {
    next(error);
  }
};

export default { create };
