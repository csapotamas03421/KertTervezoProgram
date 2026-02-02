const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// statikus fájlok
app.use(express.static("public"));
app.use("/data", express.static(path.join(__dirname, "data")));

// növény hozzáadása
app.post("/add", (req, res) => {
    const filePath = path.join(__dirname, "data", "novenyAdatok.json");
    const plants = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const newPlant = {
        id: plants.length ? Math.max(...plants.map(p => p.id)) + 1 : 1,
        magyar: req.body.magyar,
        latin: req.body.latin,
        faj: req.body.faj,
        fajta: req.body.fajta,
        sortav: Number(req.body.sortav),
        totav: Number(req.body.totav),
        szereti: req.body.szereti ? req.body.szereti.split(",").map(s => s.trim()) : [],
        nem_szereti: req.body.nem_szereti ? req.body.nem_szereti.split(",").map(s => s.trim()) : []
    };

    plants.push(newPlant);
    fs.writeFileSync(filePath, JSON.stringify(plants, null, 2));
    res.send("Növény sikeresen hozzáadva!");
});

// kert adatok mentése
app.post("/saveGarden", (req, res) => {
    const filePath = path.join(__dirname, "data", "kertAdatok.json");
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.send("Kert adatai elmentve!");
});

// szerver indítása
app.listen(3000, () => {
    console.log("Szerver fut: http://localhost:3000");
});