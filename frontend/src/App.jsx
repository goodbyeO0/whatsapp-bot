import { useState } from "react";
import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import fs from "fs";

function App() {
  const [qrData, setQrData] = useState(null);

  const client = new Client({
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    authStrategy: new LocalAuth({
      dataPath: ".wwebjs_auth",
    }),
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("qr", (qr) => {
    // Generate the QR code and set the data
    qrcode.generate(qr, { small: true }, (qrCode) => {
      setQrData(qrCode);
    });
  });

  client.initialize();

  return (
    <>
      <div>
        <h1>hello world </h1>
        {qrData && <pre>{qrData}</pre>}
      </div>
    </>
  );
}

export default App;
