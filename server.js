const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyparser.urlencoded({extended:true}));

app.use(bodyparser.json());

app.set("view engine", "ejs");

app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

app.use("/", require("./server/routes/router"));

var server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
    allowEIO3:true //False by default
})

var userConnection = [];

io.on("connection", (socket) => {
    console.log("Socket ID is: ", socket.id);
    socket.on("userconnect", (data) => {
        console.log(data.displayName, "is logged on.");
        userConnection.push({
            connectionId: socket.id,
            user_id: data.displayName
        });
        var userCount = userConnection.length;
        console.log("User Count: ", userCount);
    });
});