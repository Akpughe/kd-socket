const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = process.env.PORT || 4000;
// const { Novu, PushProviderIdEnum } = require("@novu/node");
const socketIO = require("socket.io")(http);
// const socketIO = require("socket.io")(http, {
//   cors: {
//     origin: "*",
//   },
// });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({
    message: "testing socket response",
  });
});

let messageList = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("newMessage", (schedule) => {
    console.log(schedule);
    messageList.unshift(schedule);
    socket.emit("sendMessage", messageList);

    socket.broadcast.emit("notification", messageList);
    console.log("LOG", messageList.length);
  });

  if (messageList.length > 0) {
    for (let i = 0; i < messageList.length; i++) {
      socket.emit("notification", messageList);
      socket.broadcast.emit("notification", messageList);
      console.log("LOG");
    }
  }

  // emit to clear array
  socket.on("clear", () => {
    messageList = [];
    socket.emit("sendMessage", messageList);
    // socket.broadcast.emit("sendMessage", messageList);
  });

  // emit notification for every plus 1

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
