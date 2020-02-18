const functions = require("firebase-functions");
const request = require("request-promise");
const admin = require("firebase-admin");
const payloadcreator = require("./payload");
const lah = require("lineapihelper");
admin.initializeApp(functions.config().firebase);

const UUID = require("uuid-v4");
const crypto = require("crypto");

const channelSecret = "{Enter your Channel Secret}";
const channelId = "{Enter your Channel ID}";
const baseUrl = "https://sandbox-api-pay.line.me";
const nonce = UUID();
lah.cat("{Enter your Channel access token from Messaging API}");

const genHeader = (ChannelID, ChannelSecret, URI, RequestDetail, nonce) => {
  if (typeof RequestDetail !== "string") {
    RequestDetail = JSON.stringify(RequestDetail);
  }
  const data = ChannelSecret + URI + RequestDetail + nonce;
  const signature = crypto
    .createHmac("SHA256", ChannelSecret)
    .update(data)
    .digest("base64")
    .toString();
  return {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": ChannelID,
    "X-LINE-Authorization-Nonce": nonce,
    "X-LINE-Authorization": signature
  };
};

exports.webhook = functions.region("asia-east2").https.onRequest((req, res) => {
  lah.setrequest(req);
  var payload = [];
  if (lah.eventtype() === "postback") {
    const pathUrl = "/v3/payments/request";
    body = {
      amount: 250,
      currency: "THB",
      orderId: "00001B",
      packages: [
        {
          id: "01A",
          amount: 250,
          name: "Toy Package",
          products: [
            {
              name: "ตุ๊กตา Cony",
              quantity: 1,
              price: 100,
              imageUrl:
                "https://firebasestorage.googleapis.com/v0/b/linedeveloper-63341.appspot.com/o/512x512bb.jpg?alt=media&token=7cfd10b0-6d01-4612-b42e-b1b4d0105acd"
            },
            {
              name: "ตุ๊กตา Sally",
              quantity: 1,
              price: 150,
              imageUrl:
                "https://firebasestorage.googleapis.com/v0/b/linedeveloper-63341.appspot.com/o/8cd724371a6f169b977684fd69cc2339.jpg?alt=media&token=e2008ff7-1cad-4476-a2e4-cda5f8af6561"
            }
          ]
        }
      ],
      redirectUrls: {
        confirmUrl:
          "https://us-central1-linedeveloper-63341.cloudfunctions.net/confirmOrder?userID=" +
          lah.userId(),
        cancelUrl:
          "https://us-central1-linedeveloper-63341.cloudfunctions.net/confirmOrder"
      }
    };
    var header = genHeader(channelId, channelSecret, pathUrl, body, nonce);
    console.log(header);
    return request({
      method: `POST`,
      uri: `${baseUrl}${pathUrl}`,
      headers: header,
      body: JSON.stringify(body)
    })
      .then(data => {
        var jsonparse = JSON.parse(data);
        var paymentUrl = jsonparse.info.paymentUrl.web;
        payload = [payloadcreator.startpay(paymentUrl)];
        return lah.reply(lah.replyToken(), payload);
      })
      .then(() => {
        return res.send();
      })
      .catch(e => {
        console.log(e);
        return res.send("Done");
      });
  } else {
    if (lah.message().text === "Checkout") {
      payload = [
        {
          type: "text",
          text:
            "นี่คือรายการสั่งซื้อของคุณ หากรายการถูกต้องกรุณาชำระเงินด้วย Rabbit LINE Pay"
        },
        payloadcreator.checkout()
      ];
    } else {
      payload = [
        {
          type: "text",
          text: "ไม่เข้าใจครับบ"
        }
      ];
    }
    lah
      .reply(lah.replyToken(), payload)
      .then(data => {
        console.log(data);
        res.status(200).send();
      })
      .catch(e => {
        console.log(e);
        res.status(200).send();
      });
  }
});

exports.confirmOrder = functions.https.onRequest((req, res) => {
  console.log(req.query.transactionId);
  if (typeof req.query.transactionId === "undefined") {
    return res.send("You cancled the payment");
  } else {
    const transactionId = req.query.transactionId;
    const userId = req.query.userID;
    var pathUrl = `/v3/payments/${transactionId}/confirm`;
    var body = {
      amount: 250,
      currency: "THB"
    };
    var header = genHeader(channelId, channelSecret, pathUrl, body, nonce);
    return request({
      uri: `${baseUrl}${pathUrl}`,
      method: "POST",
      headers: header,
      body: JSON.stringify(body)
    })
      .then(data => {
        var jsondata = JSON.parse(data);
        if (jsondata.returnCode === "0000") {
          var payload = [
            {
              type: "text",
              text: "การชำระเงินเสร็จสมบูรณ์ ขอบคุณที่ใช้บริการ T Store"
            },
            payloadcreator.receipt()
          ];
          return lah.push(userId, payload);
        } else {
          var payload = [
            {
              type: "text",
              text: "การชำระเงินไม่สมบูรณ์ ด้วยเหตุผลต่อไปนี้"
            },
            {
              type: "text",
              text: jsondata.returnMessage
            }
          ];
          return lah.push(userId, payload);
        }
      })
      .then(data => {
        return res.send(
          "Successfully to get the data from LINE Pay,Please return to LINE App to see the payment result"
        );
      })
      .catch(e => {
        var payload = [
          {
            type: "text",
            text: "การชำระเงินไม่สมบูรณ์ ด้วยเหตุผลต่อไปนี้"
          },
          {
            type: "text",
            text: e
          }
        ];
        return lah.push(userId, payload);
      });
  }
});
