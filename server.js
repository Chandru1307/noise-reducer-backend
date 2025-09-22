// server.js
import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `output_${Date.now()}.wav`;

  const command = `ffmpeg -i ${inputPath} -af "afftdn=nf=-25" ${outputPath}`;

  exec(command, (error) => {
    if (error) return res.status(500).send("Error processing file");

    res.download(outputPath, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
