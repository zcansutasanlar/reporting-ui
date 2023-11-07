import React, { useState, useEffect } from

  "react";
import axios from

  "axios";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactionReportResponse, setTransactionReportResponse] = useState("");
  const [transactionResponse, setTransactionResponse] = useState("");
  const [clientResponse, setClientResponse] = useState("");

  const [transactionReportVisible, setTransactionReportVisible] = useState(false);


  const [authTokenStr, setAuthtokenStr] = useState("");



  const handleSubmit = async () => {
    // Kullanıcı adı ve şifreyi bir JSON nesnesi olarak oluştur
    const loginData = {
      email,
      password,
    };
    // POST isteğini gönder
    const response = await axios.post("http://localhost:9090/api/merchant/login", loginData);

    // İsteğin yanıtını kontrol et
    if (response.data.status !== "DECLINED") {
      // Giriş başarılı
      alert("Giriş başarılı! " + response.data.status);
      console.log(response.data.data.token)
      setAuthtokenStr(response.data.data.token)
      setTransactionReportVisible(true)
    } else {
      // Giriş başarısız
      alert("Wrong Credentials!");
    }
  };

  const transactionReport = async () => {
    const jsonData = {
      fromDate: fromDate,
      toDate: toDate,
    };
    const response = axios.post("http://localhost:9090/transaction/report", jsonData, { headers: { "Authorization": `Bearer ${authTokenStr}` } }).then(
      (response) => {
        if (response !== undefined) {
          setTransactionReportResponse(JSON.stringify(response.data.data.response))
        }
      }
    ).catch((error) => {
      setTransactionResponse(" ");
      setClientResponse(" ");
      setTransactionReportResponse(" ")
      setTransactionReportVisible(false)
      console.error(error);
      // Handle error
    });
  };

  const getClient = async () => {
    const jsonData = {
      transactionId: "1067301-1675430916-3"
    };
    const response = axios.post("http://localhost:9090/client/get", jsonData, { headers: { "Authorization": `Bearer ${authTokenStr}` } }).then(
      (response) => {
        if (response.data.data.status !== "DECLINED") {
          setClientResponse(JSON.stringify(response.data.data.customerInfo))
        } else {
          setTransactionResponse(" ");
          setClientResponse(" ");
          setTransactionReportResponse(" ")
          setTransactionReportVisible(false)
        }
      }
    ).catch((error) => {
      setTransactionResponse(" ");
      setClientResponse(" ");
      setTransactionReportResponse(" ")
      setTransactionReportVisible(false)
      console.error(error);
      // Handle error
    });
  };

  const getTransaction = async () => {
    const jsonData = {
      transactionId: "1067301-1675430916-3"
    };
    const response = axios.post("http://localhost:9090/transaction/get", jsonData, { headers: { "Authorization": `Bearer ${authTokenStr}` } }).then(
      (response) => {
        if (response.data.status !== "DECLINED") {
          setTransactionResponse(JSON.stringify(response.data.data))
        }else {
          setTransactionResponse(" ");
          setClientResponse(" ");
          setTransactionReportResponse(" ")
          setTransactionReportVisible(false)
        }
      }
    ).catch((error) => {
      setTransactionResponse(" ");
      setClientResponse(" ");
      setTransactionReportResponse(" ")
      setTransactionReportVisible(false)
      console.error(error);
      // Handle error
    });
  };

  return (
    <div>
      <div style={{ display: !transactionReportVisible ? 'block' : 'none' }}>
        <h1>Login</h1>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSubmit}>Giriş yap</button>
      </div>

      <div style={{ display: transactionReportVisible ? 'block' : 'none' }}>
        <h1>Transaction Report</h1>
        <input type="text" placeholder="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="text" placeholder="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <button onClick={transactionReport}>Transaction Report</button>
        <p> {transactionReportResponse} </p>
      </div>

      <div style={{ display: transactionReportVisible ? 'block' : 'none' }}>
        <h1>Get Transaction</h1>
        <button onClick={getTransaction}>Get Transaction</button>
        <p> {transactionResponse} </p>
      </div>

      <div style={{ display: transactionReportVisible ? 'block' : 'none' }}>
        <h1>Get Client</h1>
        <button onClick={getClient}>Get Client</button>
        <p> {clientResponse} </p>
      </div>
    </div>




  );
};

/*
const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Giriş bilgilerini kullanarak API'dan JSON verilerini al

    
  }, []);
};*/

export default App;