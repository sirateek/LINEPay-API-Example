const request = require("request-promise");
var channelaccessToken = "";
var channelsecret = "";

var req;
var dialogflow = false;
module.exports = {
  channelaccesstoken: function(cat) {
    if (typeof cat === "string") {
      channelaccessToken = cat;
      return true;
    } else if (typeof cat === "undefined") {
      return channelaccessToken;
    } else {
      throw new Error("Channel access token must be a string only");
    }
  },
  cat: function(cat) {
    if (typeof cat === "string") {
      channelaccessToken = cat;
      return true;
    } else if (typeof cat === "undefined") {
      return channelaccessToken;
    } else {
      throw new Error("Channel access token must be a string only");
    }
  },
  channelsecret: function(cs) {
    if (typeof cs !== "string") {
      throw new Error("Channel Secret must be a string");
    }
    channelsecret = cs;
    return true;
  },
  reply: function(replyToken, payload) {
    if (channelaccessToken === "") {
      throw new Error(
        "You didn't set your channel access token properly, Please call .channelaccesstoken('Your channel access token') or .cat('Your channel access token') before using this command"
      );
    }
    if (typeof replyToken !== "string" || typeof replyToken === "undefined") {
      throw new Error("replyToken must be a string");
    }
    if (Array.isArray(payload) !== true || typeof payload === "undefined") {
      throw new Error(
        "payload must be an array containing the messages' payload in JSON."
      );
    }
    var x;
    var messagesbody = [];
    for (x of payload) {
      messagesbody.push(x);
    }
    const LINEHeader = {
      Authorization: "Bearer " + channelaccessToken,
      "Content-Type": "application/json"
    };

    return request({
      method: `POST`,
      uri: `https://api.line.me/v2/bot/message/reply`,
      headers: LINEHeader,
      body: JSON.stringify({
        replyToken: replyToken,
        messages: messagesbody
      })
    });
  },
  push: function(userId, payload) {
    if (channelaccessToken === "") {
      throw new Error(
        "You didn't set your channel access token properly, Please call .channelaccesstoken('Your channel access token') or .cat('Your channel access token') before using this command"
      );
    }
    if (typeof userId !== "string" || typeof userId === undefined) {
      throw new Error("userId must be a string");
    }
    if (Array.isArray(payload) !== true || typeof payload === undefined) {
      throw new Error(
        "payload must be an array containing the messages' payload in JSON."
      );
    }
    var x;
    var messagesbody = [];
    for (x of payload) {
      messagesbody.push(x);
    }
    const LINEHeader = {
      Authorization: "Bearer " + channelaccessToken,
      "Content-Type": "application/json"
    };

    return request({
      method: `POST`,
      uri: `https://api.line.me/v2/bot/message/push`,
      headers: LINEHeader,
      body: JSON.stringify({
        to: userId,
        messages: messagesbody
      })
    });
  },
  multicast: function(userList, payload) {
    if (channelaccessToken === "") {
      throw new Error(
        "You didn't set your channel access token properly, Please call .channelaccesstoken('Your channel access token') or .cat('Your channel access token') before using this command"
      );
    }
    if (Array.isArray(userList) !== true || typeof userList === undefined) {
      throw new Error(
        "userList must be an array containing the userId in string"
      );
    }
    if (Array.isArray(payload) !== true || typeof payload === undefined) {
      throw new Error(
        "payload must be an array containing the messages' payload in JSON."
      );
    }
    var x;
    var messagesbody = [];
    for (x of payload) {
      messagesbody.push(x);
    }
    const LINEHeader = {
      Authorization: "Bearer " + channelaccessToken,
      "Content-Type": "application/json"
    };

    return request({
      method: `POST`,
      uri: `https://api.line.me/v2/bot/message/multicast`,
      headers: LINEHeader,
      body: JSON.stringify({
        to: userList,
        messages: messagesbody
      })
    });
  },
  broadcast: function(payload) {
    if (channelaccessToken === "") {
      throw new Error(
        "You didn't set your channel access token properly, Please call .channelaccesstoken('Your channel access token') or .cat('Your channel access token') before using this command"
      );
    }
    if (Array.isArray(payload) !== true || typeof payload === undefined) {
      throw new Error(
        "payload must be an array containing the messages' payload in JSON."
      );
    }
    var x;
    var messagesbody = [];
    for (x of payload) {
      messagesbody.push(x);
    }
    const LINEHeader = {
      Authorization: "Bearer " + channelaccessToken,
      "Content-Type": "application/json"
    };

    return request({
      method: `POST`,
      uri: `https://api.line.me/v2/bot/message/broadcast`,
      headers: LINEHeader,
      body: JSON.stringify({
        messages: messagesbody
      })
    });
  },
  setrequest: function(requestdata) {
    if (typeof requestdata !== "object") {
      throw new Error("The request must be a request object");
    }
    if (requestdata.headers["user-agent"] === "Google-Dialogflow") {
      dialogflow = true;
    }
    req = requestdata;
    console.log(JSON.stringify(req.body));
    return true;
  },
  verify: function() {
    if (typeof req === "undefined") {
      throw new Error(
        "You didn't set the request in lineapihelper properly, Please use .setrequest('Request object') to set the request before using this command"
      );
    }
    if (channelsecret === "") {
      throw new Error(
        "You didn't set the channel secret properly, Please use .channelsecret('')"
      );
    }
    if (dialogflow) {
      return true;
    }
    const crypto = require("crypto");
    var reqbody = JSON.stringify(req.body);
    const linesignature = crypto
      .createHmac("SHA256", channelsecret)
      .update(reqbody)
      .digest("base64")
      .toString();
    if (req.headers["x-line-signature"] === linesignature) {
      return true;
    } else {
      return false;
    }
  },
  replyToken: function() {
    if (typeof req === "undefined") {
      throw new Error(
        "You didn't set the request in lineapihelper properly, Please use .setrequest('Request object') to set the request before using this command"
      );
    }
    var replyToken;
    if (dialogflow) {
      replyToken = req.body.originalDetectIntentRequest.payload.data.replyToken;
    } else {
      replyToken = req.body.events[0].replyToken;
    }
    if (replyToken === "undefined") {
      return false;
    } else {
      return replyToken;
    }
  },
  userId: function() {
    if (typeof req === "undefined") {
      throw new Error(
        "You didn't set the request in lineapihelper properly, Please use .setrequest('Request object') to set the request before using this command"
      );
    }
    var userId;
    if (dialogflow) {
      userId = req.body.originalDetectIntentRequest.payload.data.source.userId;
    } else {
      userId = req.body.events[0].source.userId;
    }

    if (typeof userId === "undefined") {
      return false;
    } else {
      return userId;
    }
  },
  roomId: function() {
    if (typeof req === "undefined") {
      throw new Error(
        "You didn't set the request in lineapihelper properly, Please use .setrequest('Request object') to set the request before using this command"
      );
    }
    var roomId;
    if (dialogflow) {
      roomId = req.body.originalDetectIntentRequest.payload.data.source.roomId;
    } else {
      roomId = req.body.events[0].source.roomId;
    }

    if (typeof roomId === "undefined") {
      return false;
    } else {
      return roomId;
    }
  },
  groupId: function() {
    if (typeof req === "undefined") {
      throw new Error(
        "You didn't set the request in lineapihelper properly, Please use .setrequest('Request object') to set the request before using this command"
      );
    }
    var groupId;
    if (dialogflow) {
      groupId =
        req.body.originalDetectIntentRequest.payload.data.source.groupId;
    } else {
      groupId = req.body.events[0].source.groupId;
    }

    if (typeof groupId === "undefined") {
      return false;
    } else {
      return groupId;
    }
  },
  sourcetype: function() {
    if (typeof req === "undefined") {
      throw new Error(
        "You didn't set the request in lineapihelper properly, Please use .setrequest('Request object') to set the request before using this command"
      );
    }
    var sourcetype;
    if (dialogflow) {
      sourcetype =
        req.body.originalDetectIntentRequest.payload.data.source.type;
    } else {
      sourcetype = req.body.events[0].source.type;
    }
    if (typeof sourcetype === "undefined") {
      return false;
    } else {
      return sourcetype;
    }
  },
  eventtype: function() {
    if (typeof req === "undefined") {
      throw new Error(
        "You didn't set the request in lineapihelper properly, Please use .setrequest('Request object') to set the request before using this command"
      );
    }
    var eventtype;
    if (dialogflow) {
      eventtype = req.body.originalDetectIntentRequest.payload.data.type;
    } else {
      eventtype = req.body.events[0].type;
    }
    if (typeof eventtype === "undefined") {
      return false;
    } else {
      return eventtype;
    }
  },
  message: function() {
    if (typeof req === "undefined") {
      throw new Error(
        "You didn't set the request in lineapihelper properly, Please use .setrequest('Request object') to set the request before using this command"
      );
    }
    var messagebody;
    if (dialogflow) {
      messagebody = req.body.originalDetectIntentRequest.payload.data.message;
    } else {
      messagebody = req.body.events[0].message;
    }
    return messagebody;
  },
  getcontent: function(messageId) {
    if (channelaccessToken === "") {
      throw new Error(
        "You didn't set your channel access token properly, Please call .channelaccesstoken('Your channel access token') or .cat('Your channel access token') before using this command"
      );
    }
    if (typeof messageId !== "string") {
      throw new Error("messageId must be a string");
    }
    const LINEHeader = {
      Authorization: "Bearer " + channelaccessToken
    };
    return request({
      method: `GET`,
      uri: `https://api.line.me/v2/bot/message/${messageId}/content`,
      headers: LINEHeader
    });
  }
};
