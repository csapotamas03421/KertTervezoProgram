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

        // Legnagyobb ID meghatározása
        const maxId = plants.length > 0
            ? Math.max(...plants.map(p => p.id))
            : 0;

        const newPlant = {
            id: maxId + 1,   // <<< Folyamatos növekvő ID
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

// szerver indítása
app.listen(3000, () => {
    console.log("Szerver fut: http://localhost:3000");
});
