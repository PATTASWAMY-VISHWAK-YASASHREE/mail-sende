const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const os = require("os");

const app = express();

// Enable JSON body parsing
app.use(express.json());

// SMTP Configuration
const SMTP_SERVER = "smtp.gmail.com";
const SMTP_PORT = 587;
const SENDER_EMAIL = "pvishwak18@gmail.com";
const SENDER_PASSWORD = "zwfl dmmd iqvc eqgg";

// Function to get the latest file from a folder
function getLatestFile(downloadFolder) {
  const files = fs.readdirSync(downloadFolder).map((file) => ({
    name: file,
    time: fs.statSync(path.join(downloadFolder, file)).mtime.getTime(),
  }));
  if (files.length === 0) return null;
  const latestFile = files.sort((a, b) => b.time - a.time)[0];
  return path.join(downloadFolder, latestFile.name);
}

const DOWNLOADS_FOLDER = path.join(os.homedir(), "Downloads");

// POST route to accept JSON data (including email)
app.post("/", async (req, res) => {
  const recipientEmail = req.body.email; // email from JSON request
  const latestFilePath = getLatestFile(DOWNLOADS_FOLDER);

  if (!recipientEmail) {
    return res.status(400).send("Error: Recipient email is required!");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    },
  });

  const mailOptions = {
    from: SENDER_EMAIL,
    to: recipientEmail,
    subject: "Automated Email with Latest Downloaded Report",
    html: `
      <html>
      <head></head>
      <body>
          <h2 style="color: blue;">Hello,</h2>
          <p>This is an <b>automated email</b> with your latest downloaded report.</p>
          <p style="color: green;">Best regards,<br>SYNTAX SQUAD</p>
      </body>
      </html>
    `,
  };

  if (latestFilePath) {
    mailOptions.attachments = [
      {
        filename: path.basename(latestFilePath),
        path: latestFilePath,
      },
    ];
    console.log(`Attaching file: ${latestFilePath}`);
  } else {
    console.log("No downloaded files found!");
  }

  try {
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});