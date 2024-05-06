import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

function App() {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrScanned, setQrScanned] = useState(false);
  const [number, setNumber] = useState([]);
  const [input, setInput] = useState("");
  const endpoint = "http://localhost:3001/qr";

  useEffect(() => {
    const getData = async () => {
      const rawData = await fetch(endpoint);
      const dataJson = await rawData.json();
      if (dataJson.status) {
        setQrScanned(true);
      } else {
        setQr(dataJson);
      }
      setLoading(false);
    };

    getData();
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = () => {
    setNumber([...number, input]);
    setInput("");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/logout", {
        method: "POST",
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log("Error : ", err);
    }
  };

  const handleSendToApi = async () => {
    try {
      const response = await fetch("http://localhost:3001/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numbers: number }),
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  console.log(number);

  return (
    <>
      <div className="p-8 ">
        <div className="mb-12 text-6xl font-bold text-slate-600">
          WHATSAPP AUTOMATION
        </div>
        {loading ? (
          <div className="text-xl font-semibold text-red-500">Loading ...</div>
        ) : qrScanned ? (
          <div>QR code has been scanned</div>
        ) : (
          <div>
            Qr : <QRCode value={qr.qrData} />
          </div>
        )}
        <div className="flex justify-between mt-11">
          <button
            onClick={handleSubmit}
            className="p-2 text-teal-200 bg-teal-800 rounded-lg"
          >
            Submit
          </button>
          <button
            onClick={handleSendToApi}
            className="p-2 text-teal-200 bg-teal-800 rounded-lg"
          >
            Send to Api
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-teal-200 bg-teal-800 rounded-lg"
          >
            Logout
          </button>
        </div>
        <label className="font-semibold text-green-700">Phone number </label>
        <input
          type="text"
          onChange={handleInputChange}
          value={input}
          className="bg-green-300 rounded-lg"
        />
        <p>
          {number.map((data, i) => {
            return <div key={i}>{data}</div>;
          })}
        </p>
      </div>
    </>
  );
}

export default App;
