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
const dbconn = require("./helpers/dbconn");
const { time } = require("console");
const { Contact, Product, Chat } = require("whatsapp-web.js/src/structures");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const TOKEN = "citrajayasentosa";
const mysql = require("mysql2/promise");
require("dotenv").config();

const Message = require("whatsapp-web.js/src/structures/Message");
const { default: puppeteer } = require("puppeteer");

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
    headless: false,
    executablePath: process.env.NODE_ENV==='production' ?  process.env.PUPPETEER_EXECUTABLE_PATH :puppeteer.executablePath(),
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
async function reppro() {
  const mulai = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "rd",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 39900000,
  });
  let buttt = [];
  const [prod] = await mulai.execute(
    `SELECT category from product where top is not null group by category limit 2`
  );
  var length = Object.keys(prod).length;
  for (var pa = 0; pa < length; pa++) {
    buttt.push({
      body: prod[pa].category.substr(prod[pa].category.length - 15),
      id: "22",
    });
  }
  const media = await MessageMedia.fromUrl(
    "https://cdn.naturettl.com/wp-content/uploads/2020/02/05200812/12-best-landscape-photography-locations-in-canada.jpg"
  );
  console.log(buttt);
  const bupro = new Buttons("media", buttt, "title", "list");
  await client.sendMessage(`6282142608613@c.us`, bupro);
  await client.sendMessage(`6281937772814@c.us`, bupro);
}
let welc = [
  "pagi..",
  "pagi..",
  "pagii..",
  "halo",
  "permisi.",
  "selamat pagi.",
  "selamat pagi ..",
  "selamat pagi...",
  "assalamualaikum",
  "assallamualaikum",
  "selamat pagi,",
];
let welc1 = [
  "siang..",
  "siang,",
  "siangg..",
  "halo",
  "permisi.",
  "selamat siang.",
  "selamat siang ..",
  "selamat Siang...",
  "assalamualaikum",
  "assallamualaikum",
  "selamat Siang,",
];
let welc2 = [
  "Sore..",
  "Soree..",
  "sore..",
  "halo",
  "permisi.",
  "selamat sore.",
  "selamat sore ..",
  "selamat Soree...",
  "assalamualaikum",
  "assallamualaikum",
  "selamat sore,",
];
let welc3 = [
  "malemm..",
  "mlem..",
  "malem..",
  "halo",
  "permisi.",
  "selamat mlm.",
  "selamat malem ..",
  "selamat mlem...",
  "assalamualaikum",
  "assallamualaikum",
  "selamat malem,",
];
async function tat() {
  const reply = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "rd",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 39900000,
  });
  let data = [];
  const yy = await client.getChats();
  if (yy.isGroup) {
    console.log("ikigroup");
  } else {
    for (var pii = 0; pii < yy.length; pii++) {
      let yiy = await yy[pii].fetchMessages({
        limit: 1,
      });
      //console.log(yiy)
      if (yiy[0] !== undefined) {
        //console.log(yiy[0])
        if (yiy[0].fromMe === false) {
          const lyyy = await cenm(yiy[0]._data.from._serialized);
          var nama = "";
          //console.log(lyyy['pushname'])
          var namaori = lyyy["pushname"];
          if (namaori !== undefined) {
            nama = namaori.replace(/[^a-zA-Z0-9 ]/g, "");
          } else {
            nama = "didnotdefined";
          }

          var body = yiy[0]._data.body;
          if (yiy[0]._data.body !== undefined) {
            body = yiy[0]._data.body.replace(/[^a-zA-Z0-9 ]/g, "");
          } else {
            body = "deleted/err";
          }
          const [mlb] = await reply.execute(
            `insert into nomapp (appno,pushname,textRepl,replied, device,timereplied) values (?,?,?,?,?,?) 
          on duplicate key update device =?,textRepl=?,replied=?,timereplied=?,pushname=?`,
            [
              yiy[0]._data.from._serialized,
              nama,
              body,
              "1",
              yiy[0].deviceType,
              moment.unix(yiy[0]._data.t).format("YYYY-MM-DD HH:mm:ss"),
              yiy[0].deviceType,
              body,
              "1",
              moment.unix(yiy[0]._data.t).format("YYYY-MM-DD HH:mm:ss"),
              nama,
            ]
          );
          console.log(mlb);
          data.push(
            "*" +
              yiy[0]._data.from.user +
              "*\n" +
              moment.unix(yiy[0]._data.t).format("YYYY-MM-DD HH:mm:ss") +
              "\n" +
              body +
              "\n" +
              "Replied, *" +
              yiy[0].deviceType +
              "*\n\n"
          );
        }
      }
    }
    var d = data.length;
    data.push(d);
    dataStr = data.toString();

    client.sendMessage(`6282142608613@c.us`, d.toString());
    client.sendMessage(`6282142608613@c.us`, dataStr);
  }
}

async function welcome() {
  const mulai = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "rd",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 39900000,
  });
  const [nomer] = await mulai.execute(
    `SELECT appno from nomapp where appno like '628%' and updated is not null and updated >='2023-02-12 00:00:00' and active ='1' 
    and not oncontact = '1' and isapp='1'`
  );
  var length = Object.keys(nomer).length;
  for (var na = 0; na < length; na++) {
    const [cek] = await mulai.execute(
      `SELECT appno from blasted where appno =?`,
      [nomer[na].appno]
    );
    //console.log(cek.length);
    if (cek.length < 1) {
      const cdd = await cenm(nomer[na].appno);
      if (cdd["isMyContact"] === false) {
        var dateblast = new Date();

        var hari = moment(dateblast).format("YYYY-MM-DD");
        var jam = moment(dateblast).format("HH:mm:ss");
        var today = new Date().getHours();
        if (today >= 6 && today <= 10) {
          var kalimat = await welc[getRand(0, 10)];
          console.log(kalimat);
        } else if (today >= 10 && today <= 14) {
          var kalimat = await welc1[getRand(0, 10)];
          console.log(kalimat);
        } else if (today >= 15 && today <= 17) {
          var kalimat = await welc2[getRand(0, 10)];
          console.log(kalimat);
        } else if (today >= 17 && today <= 23) {
          var kalimat = await welc3[getRand(0, 10)];
          console.log(kalimat);
        }

        var random = getRand(240000, 360000);
        const [blast] = await mulai.execute(
          `insert into blasted (appno,body,created_date, created_time) values (?,?,?,?)`,
          [nomer[na].appno, kalimat, hari, jam]
        );
        client.sendMessage(nomer[na].appno, kalimat);
        console.log(hari, jam, " sent !");
        await sleep(random);
      } else {
        console.log(cdd);
      }
    } else {
      //console.log("skip");
    }
  }
}

async function checkapp() {
  const start = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "rd",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  const [rows] = await start.execute(
    "SELECT appno from nomapp where appno like '628%' and updated is null"
  );
  var isi = Object.keys(rows).length;
  for (var i = 0; i < isi; i++) {
    const isRegisteredNumber = await checkRegisteredNumber(rows[i].appno);
    if (isRegisteredNumber === true) {
      nom = 1 + i;
      try {
        const ccc = await cenm(rows[i].appno);
        console.log(nom + ". " + ccc["name"]);
        const [rows1] = await start.execute(
          `
      insert into nomapp (appno,privname,pushname,shortname,
        active,oncontact,isblocked,isapp,isgroup)
         values(?,?,?,?,?,?,?,?,?) on duplicate key update 
         privname=?,pushname=?,shortname=?,
         active=?,oncontact=?,isblocked=?,isapp=?,isgroup=?;`,
          [
            rows[i].appno,
            ccc["name"] === undefined
              ? "kosong"
              : ccc["name"].replace(/[^a-zA-Z0-9 ]/g, ""),
            ccc["pushname"] === undefined
              ? "kosong"
              : ccc["pushname"].replace(/[^a-zA-Z0-9 ]/g, ""),
            ccc["shortName"] === undefined
              ? "kosong"
              : ccc["shortName"].replace(/[^a-zA-Z0-9 ]/g, ""),
            ccc["isUser"],
            ccc["isMyContact"],
            ccc["isBlocked"],
            ccc["isWAContact"],
            ccc["isGroup"],
            ccc["name"] === undefined
              ? "kosong"
              : ccc["name"].replace(/[^a-zA-Z0-9 ]/g, ""),
            ccc["pushname"] === undefined
              ? "kosong"
              : ccc["pushname"].replace(/[^a-zA-Z0-9 ]/g, ""),
            ccc["shortName"] === undefined
              ? "kosong"
              : ccc["shortName"].replace(/[^a-zA-Z0-9 ]/g, ""),
            ccc["isUser"],
            ccc["isMyContact"],
            ccc["isBlocked"],
            ccc["isWAContact"],
            ccc["isGroup"],
          ]
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const [rows1] = await start.execute(
          `
      insert into nomapp (appno,privname,pushname,shortname,
        active,oncontact,isblocked,isapp,isgroup)
         values(?,'-','-','-','-','-','-','-','-') on duplicate key update         
         privname='-',pushname='-',shortname='-',
         active='-',oncontact='-',isblocked='-',isapp='-',isgroup='-';
         `,
          [rows[i].appno]
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
}

async function product(sender) {
  const prostart = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "rd",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  const [pro] = await prostart.execute(
    "SELECT vsbl,top,hreftop,prisub, format((((pricedrop +12000)*10/100)+(pricedrop +22000)),0)  as duid from product where hreftop is not null limit 1"
  );
  try {
    const media = await MessageMedia.fromUrl(pro[0].vsbl);
    const buttonpro = new Buttons(
      media,
      [
        {
          body: "Simpan",
          id: "test-1",
        },
        {
          body: "Tokopedia",
          url: pro[0].hreftop,
        },
      ],
      "title",
      pro[0].duid
    );
    console.log(pro[0].vsbl);
    console.log(pro[0].hreftop);
    console.log(pro[0].top);
    console.log(pro[0].prisub);
    console.log(pro[0].duid);
    await client.sendMessage(sender, buttonpro, {
      caption: `*${pro[0].top}*\n\nRp${pro[0].duid}`,
    });
    await client.sendMessage(`6281937772814@c.us`, buttonpro, {
      caption: `*${pro[0].top}*\n\nRp${pro[0].duid}`,
    });
    await client.sendMessage(`6282134796936@c.us`, buttonpro, {
      caption: `*${pro[0].top}*\n\nRp${pro[0].duid}`,
    });
  } catch (e) {
    console.log("bedjat", e);
  }
}
const resolveStatusTimestamp = async (message) => {
  const info = await message.getInfo();
  console.log(info);
};

async function replies(sender){
  //const media = await MessageMedia.fromUrl(pro[0].vsbl);
    const buttonpro = new Buttons(
      'Fashion',      
      [
        
        {
          body: "Tokopedia",
          url: 'https://tokopedia.link/oKoeMt5kfxb',
        },
        {
          body: "ya, infokan",
          id: "bersedia",
        },
        
      ],
      "Halo kak, Selamat datang di Whatsapp Otomatis -gl.amooure-\n\nKami bergerak dalam bidang Fashion. Melayani retail maupun grosir\ndan juga melayani dropship\n\n\nTekan YA jika anda ingin mendapatkan info seputar promo / diskon kami",
      'gl.amooure 2020',
    );
    client.sendMessage(sender,buttonpro)
}


client.on("message", async (msg) => {
  if (msg.from == "6282142608613@c.us" && msg.body === "tt") {
    welcome();
  } else if (msg.from == "6282142608613@c.us" && msg.body === "12") {
    resolveStatusTimestamp();
  } else if (msg.from == "6282142608613@c.us" && msg.body === "op") {
    client.sendMessage(msg.from, "hmm..");
    await product(msg.from);
    await reppro();
  } else if (msg.from == "6282142608613@c.us" && msg.body === "pop") {
    checkapp();
  } else if (msg.from == "6282142608613@c.us" && msg.body === "pingo") {
    client.sendMessage(msg.from, "hmm.."+msg.body);
  } else if (msg.from == "6282142608613@c.us"){
    await replies(msg.from)
  } else if (msg.from == "6282142608613@c.us" && msg.body === "pd") {
    tat();
    // await client.sendMessage(msg.from, bu);
    // await client.sendMessage(msg.from, but);
    // await client.sendMessage(msg.from, butt);
    // await client.sendMessage(msg.from, butto);
  }
});

client.on("message_ack", (msg, ack) => {
  /*
      == ACK VALUES ==
      ACK_ERROR: -1
      ACK_PENDING: 0
      ACK_SERVER: 1
      ACK_DEVICE: 2
      ACK_READ: 3
      ACK_PLAYED: 4
  */
  if (ack == 2) {
    // console.log(msg)
    // console.log(ack)
    // console.log('asu')
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
