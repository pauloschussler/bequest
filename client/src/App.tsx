import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [originalData, setOriginalData] = useState<string>("");
  const [isDataInvalid, setIsDataInvalid] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {

    const response = await fetch(API_URL);

    const { data } = await response.json();

    setData(data);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const temperData = async () => {
    await fetch(API_URL + '/temper', {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    const response = await fetch(API_URL);

    if (response.ok) {
      const { data } = await response.json();
      alert("Data verified successfully: " + data);
      setIsDataInvalid(false);
    } else {
      throw new Error('Data integrity check failed');
    }
  };

  const restoreData = async () => {
    await fetch(API_URL + '/recover', {
      method: 'GET',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    setIsDataInvalid(false);
    await getData();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        {data !== originalData && (
          <button style={{ fontSize: "20px" }} onClick={temperData}>
            Temper Data
          </button>
        )}
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        {isDataInvalid && (
          <button style={{ fontSize: "20px" }} onClick={restoreData}>
            Restore Data
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
