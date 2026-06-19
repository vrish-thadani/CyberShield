const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

let threats = [];

const randomThreats = [
  "Ransomware",
  "Zero-Day",
  "Phishing",
  "Malware",
  "Botnet",
  "DDoS",
  "APT Attack"
];

const regions = [
  "USA",
  "India",
  "Germany",
  "Japan",
  "UK",
  "Brazil"
];

const severities = [
  "Low",
  "Medium",
  "High",
  "Critical"
];

setInterval(() => {

  threats.unshift({
    id: Date.now(),
    name: randomThreats[Math.floor(Math.random()*randomThreats.length)],
    severity: severities[Math.floor(Math.random()*severities.length)],
    region: regions[Math.floor(Math.random()*regions.length)],
    time: new Date().toLocaleTimeString()
  });

  if(threats.length > 20){
    threats.pop();
  }

},5000);

app.get("/api/threats",(req,res)=>{
  res.json(threats);
});

app.get("/api/dashboard",(req,res)=>{

  const critical =
    threats.filter(t=>t.severity==="Critical").length;

  const high =
    threats.filter(t=>t.severity==="High").length;

  res.json({
    totalThreats: threats.length,
    criticalAlerts: critical,
    activeIncidents: high,
    protectedSystems: 45
  });

});

app.post("/api/threats",(req,res)=>{

  const threat = {
    id: Date.now(),
    ...req.body,
    time:new Date().toLocaleTimeString()
  };

  threats.unshift(threat);

  res.json(threat);

});

app.listen(3000,()=>{
  console.log("CyberShield Running on Port 3000");
});