const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 3001;

app.get("/stations", async (req, res) => {
  const { bbox } = req.query;
  try {
    const response = await fetch(`https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?bbox=${bbox}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stations" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});