const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:4000" });

let onlineUsers = [];

io.on("connection", (socket) => {
  //listen to connection
  socket.on("addNewUser", (userID) => {
    // check if user online
    !onlineUsers.some((user) => user.userID === userID) &&
      onlineUsers.push({
        userID,
        socketID: socket.id,
      });

    // send event to client
    console.log(onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketID !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
