const express = require('express');
const router = express.Router();
const Order = require('../models/midtrans');
const midtransClient = require('midtrans-client');
require('dotenv').config();


const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY
});

router.get('/', function (req, res, next) {
  Order.findAll().then(data => {
    const tampilData = data.map(item => {
      return {
        order_id: item.order_id,
        seller_id: item.seller_id,
        buyer_id: item.buyer_id,
        title: item.title,
        description: item.description,
        response_midtrans: JSON.parse(item.response_midtrans),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    });
    res.json({
      status: true,
      pesan: "Success",
      data: tampilData
    });
  }).catch(err => {
    res.json({
      status: false,
      pesan: "Failed: " + err.message,
      data: []
    });
  });
});

router.post('/charge', function (req, res, next) {
  const orderId = 'order-' + Date.now();

  req.body.transaction_details = {
    order_id: orderId,
    gross_amount: req.body.transaction_details.gross_amount
  };

  coreApi.charge(req.body).then((chargeResponse) => {
    const dataOrder = {
      order_id: orderId,
      seller_id: req.body.seller_id,
      buyer_id: req.body.buyer_id,
      title: req.body.title,
      description: req.body.description,
      response_midtrans: JSON.stringify(chargeResponse)
    };
    Order.create(dataOrder).then(data => {
      res.json({
        status: true,
        pesan: "Success Order",
        data: data
      });
    }).catch(err => {
      res.json({
        status: false,
        pesan: "Failed Order: " + err.message,
        data: []
      });
    });
  }).catch((e) => {
    res.json({
      status: false,
      pesan: "Failed order: " + e.message,
      data: []
    });
  });
});


router.post('/notifikasi', function (req, res, next) {
  coreApi.transaction.notification(req.body)
    .then((statusResponse) => {
      let orderId = statusResponse.order_id;
      let responseMidtrans = JSON.stringify(statusResponse);
      Order.update({ response_midtrans: responseMidtrans }, {
        where: { order_id: orderId }
      }).then(() => {
        res.json({
          status: true,
          pesan: "Success",
          data: []
        });
      }).catch(err => {
        res.status(500).json({
          status: false,
          pesan: "Failed: " + err.message,
          data: []
        });
      });
    });
});

router.get('/status/:order_id', function (req, res, next) {
  coreApi.transaction.status(req.params.order_id).then((statusResponse) => {
    let responseMidtrans = JSON.stringify(statusResponse);
    Order.update({ response_midtrans: responseMidtrans }, {
      where: { order_id: req.params.order_id }
    }).then(() => {
      res.json({
        status: true,
        pesan: "Berhasil cek status",
        data: statusResponse
      });
    }).catch(err => {
      res.json({
        status: false,
        pesan: "Gagal cek status: " + err.message,
        data: []
      });
    });
  });
});

module.exports = router;
