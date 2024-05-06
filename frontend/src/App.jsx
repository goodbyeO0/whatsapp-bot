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
      <div className="text-6xl font-bold ">Hello test</div>
      <input type="text" onChange={handleInputChange} value={input} />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleSendToApi}>Send to Api</button>
      {loading ? (
        <div>Loading ...</div>
      ) : qrScanned ? (
        <div>QR code has been scanned</div>
      ) : (
        <div>
          Qr : <QRCode value={qr.qrData} />
        </div>
      )}
      <p>
        {number.map((data, i) => {
          return <div key={i}>{data}</div>;
        })}
      </p>
    </>
  );
}

export default App;
