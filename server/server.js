const excelUtils = require("../utils/excelutils");
const dbClass = require("../db/memorydb");
const db = new dbClass.DB();
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("frontScripts"));
app.use(fileUpload())

app.get("/", async (req, res) => res.sendFile(path.resolve("./pages/index.html")));

app.get("/reports", async (req, res) => {
    excelFiles = db.getFiles();
    if (excelFiles.length > 0)
        return res.send(excelFiles.map((f, i) => {
            return {
                index: i,
                name: f.name,
                link: `reportIndex=${i}`
            }
        }));
    return res.sendStatus(404);
});

app.get("/viewReport", async (req, res) => {
    return res.sendFile(path.resolve("./pages/viewReport.html"));
});

app.get("/getReport", async (req, res) => {
    const index = req.query.reportIndex;
    excelFile = db.getFile(index);
    if (excelFile)
        return res.send(await excelUtils.getExcelData(excelFiles[index]));
    return res.sendStatus(404);
});

app.post("/uploadFiles", async (req, res) => {
    if (!req.files)
        return res.sendStatus("400");
    db.add(req.files.excelFile);
    return res.redirect("/");
});

app.get("/deleteReport", async (req, res) => {
    if (req.query.reportIndex && db.getFile(req.query.reportIndex)) {
        db.remove(req.query.reportIndex);
        return res.redirect("/");
    }
    return res.sendStatus(404);
});

app.listen(port);