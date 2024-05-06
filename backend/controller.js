const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require("express")
const cors = require("cors")

let qrScanned = false;
const app = express()
app.use(express.json())
app.use(cors())

const client = new Client({
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    authStrategy: new LocalAuth({
        dataPath: ".wwebjs_auth"
    }),
});

client.on('ready', () => {
    console.log('Client is ready!');
});


client.on("authenticated", () => {
    console.log("Client is authenticated!")
    qrScanned = true
})

app.get("/qr", (req, res) => {
    if (qrScanned) {
        res.send({ status: "QR code has been scanned" })
    } else {
        new Promise((resolve) => {
            client.once("qr", resolve);
        })
            .then((qrData) => {
                res.send({ qrData })
            })
    }
});

app.post('/api', (req, res) => {
    console.log(req.body); // Log the request body to the console
    // Send a response back to the client
    res.json({ message: 'Data received successfully' });

    const numbers = req.body.numbers;
    numbers.forEach(async (number) => {
        const chatId = number + "@c.us";
        client.sendMessage(chatId, "ma fren 2");
    });
});

app.post("/logout", async (req, res) => {
    try {
        console.log("Logging out...");
        await client.logout();
        console.log("Logged out. Destroying client...");
        await client.destroy();
        console.log("Client destroyed. Logged out successfully")
        res.json({ message: "Logged out successfully" })
    } catch (err) {
        console.error("An error occurred while logging out:", err);
        res.status(500).json({ message: "An error occurred while logging out" });
    }
})

client.initialize();

app.listen(3001, () => {
    console.log("listen on port 3001 ...")
})