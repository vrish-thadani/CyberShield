const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

let threats = [];

app.get("/api/threats", (req, res) => {
    res.json(threats);
});

app.post("/api/threats", (req, res) => {

    const threat = {
        id: Date.now(),
        ...req.body,
        timestamp: new Date()
    };

    threats.push(threat);

    res.json(threat);
});

app.get("/health", (req, res) => {
    res.json({
        status: "UP"
    });
});

app.listen(3000, () => {
    console.log("CyberShield Running on Port 3000");
});