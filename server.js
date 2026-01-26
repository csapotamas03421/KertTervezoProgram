const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// HTML formok miatt kell
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// statikus fájlok (pl. index.html)
app.use(express.static("public"));

// POST: új növény hozzáadása
app.post("/add", (req, res) => {
    const filePath = path.join(__dirname, "data", "novenyAdatok.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) throw err;

        const plants = JSON.parse(data);

        const maxId = plants.length > 0
            ? Math.max(...plants.map(p => p.id))
            : 0;

        const newPlant = {
            id: maxId + 1,
            latin: req.body.latin,
            magyar: req.body.magyar,
            faj: req.body.faj,
            fajta: req.body.fajta,
            sortav: parseInt(req.body.sortav),
            totav: parseInt(req.body.totav),
            szereti: req.body.szereti ? req.body.szereti.split(",").map(s => s.trim()) : [],
            nem_szereti: req.body.nem_szereti ? req.body.nem_szereti.split(",").map(s => s.trim()) : []
        };

        plants.push(newPlant);

        fs.writeFile(filePath, JSON.stringify(plants, null, 2), (err) => {
            if (err) throw err;
            res.send("Növény sikeresen hozzáadva!");
        });
    });
});

// POST: kert adatok mentése
app.post("/saveGarden", (req, res) => {
    const filePath = path.join(__dirname, "data", "kertAdatok.json");

    //console.log("Kapott adatok:", req.body); // DEBUG

    const gardenData = {
        kert_szelessege: req.body.kert_szelessege,
        kert_magassaga: req.body.kert_magassaga,
        agyasok_szelessege: req.body.agyasok_szelessege,
        agyasok_magassaga: req.body.agyasok_magassaga,
        agyasok_darabszama: req.body.agyasok_darabszama
    };

    fs.writeFile(filePath, JSON.stringify(gardenData, null, 2), (err) => {
        if (err) {
            console.error("Hiba a kert mentésekor:", err);
            return res.status(500).send("Hiba történt a mentés során.");
        }

        res.send("Kert adatai sikeresen elmentve!");
    });
});

// szerver indítása
app.listen(3000, () => {
    console.log("Szerver fut: http://localhost:3000");
});