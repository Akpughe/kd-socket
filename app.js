const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;
// const { Novu, PushProviderIdEnum } = require("@novu/node");
const socketIO = require("socket.io")(http, {
  // cors: {
  //   origin: *,
  // },

  // allow all cors
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let messageList = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("newMessage", (schedule) => {
    console.log(schedule);
    messageList.unshift(schedule);
    socket.emit("sendMessage", messageList);
  });

  socket.emit("notification", messageList);

  // let interval = setInterval(function () {
  //   if (messageList.length > 0) {
  //     for (let i = 0; i < messageList.length; i++) {
  //       socket.emit("notification", messageList);
  //       // socket.emit("notification", {
  //       //   title: messageList[i].title,
  //       //   hour: messageList[i].hour,
  //       //   mins: messageList[i].minute,
  //       // });
  //     }
  //   }
  // }, 1000);

  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
