const {
  Client,
  MessageMedia,
  Buttons,
  List,
  ChatTypes,
  LocalAuth,
} = require("whatsapp-web.js");
const cron = require("node-cron");
const cors = require("cors");
const express = require("express");
var nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const socketIO = require("socket.io");
var Stream = require("stream").Transform;
const qrcode = require("qrcode-terminal");
const QRCode = require("qrcode");
const http = require("http");
const fs = require("fs");
const { phoneNumberFormatter } = require("./helpers/formatter");
const fileUpload = require("express-fileupload");
const axios = require("axios");
const mime = require("mime-types");
var moment = require("moment");
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const TOKEN = "citrajayasentosa";
const mysql = require("mysql2/promise");
require("dotenv").config();

const Message = require("whatsapp-web.js/src/structures/Message");


app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  fileUpload({
    debug: true,
  })
);
app.use(cors());

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
app.get("/", cors(), (req, res) => {
  res.sendFile("index.html", {
    root: __dirname,
  });
});

const client = new Client({
  puppeteer: {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
  authStrategy: new LocalAuth(),
});

const checkRegisteredNumber = async function (number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
};

const cenm = async function (number) {
  const nm = await client.getContactById(number);
  //console.log(nm);
  return nm;
};
client.on("message", async (msg) => {
  if (msg.from == "6282142608613@c.us" && msg.body === "pingo") {
    client.sendMessage(msg.from, "hmm.."+msg.body);
  }
});

client.initialize();

io.on("connection", function (socket) {
  socket.emit("message", "Connecting...");
  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    QRCode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit("message", "QR Code received, scan please!");
    });
  });

  client.on("ready", () => {
    //unread()
    console.log("dah !");
    var d = new Date();
    var dtm = moment(d).format("YYYY-MM-DD HH:mm:ss");
    console.log("Ready " + dtm);
    socket.emit("ready", "Whatsapp is ready!");
    socket.emit("message", "Whatsapp is ready on  >>>>>   : " + dtm);
    //checkapp();
  });

  client.on("authenticated", () => {
    var d = new Date();
    var dtm = moment(d).format("YYYY-MM-DD HH:mm:ss");
    socket.emit("authenticated", "Whatsapp is authenticated!");
    socket.emit("message", "Whatsapp is authenticated on : " + dtm);
    console.log("AUTHENTICATED " + dtm);
  });

  client.on("auth_failure", function (session) {
    socket.emit("message", "Auth failure, restarting...");
  });

  client.on("disconnected", (reason) => {
    socket.emit("message", "Whatsapp is disconnected!");
    console.log(reason);
    client.initialize();
  });
});

server.listen(port, function () {
  console.log("App running on *: " + port);
  //  task.start();
});