import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const initialState = '';
  const [name, setName] = useState(initialState);
  const [price, setPrice] = useState(initialState);
  const [datetime, setDatetime] = useState(initialState);
  const [description, setDescription] = useState(initialState);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = () => {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    fetch(url)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error('Failed to fetch transactions:', err));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, description, datetime }),
    })
      .then(async response => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error ${response.status}: ${text}`);
        }
        return response.json();
      })
      .then(json => {
        setName('');
        setPrice('');
        setDescription('');
        setDatetime('');
        fetchTransactions(); // refresh the list
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Calculate total balance
  const total = transactions.reduce((acc, t) => acc + parseFloat(t.price), 0);

  return (
    <div>
      <main>
        <h1>
          Rs.{total.toFixed(2)}
        </h1>

        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={ev => setName(ev.target.value)}
              placeholder={'+200 new samsung tv'}
              required
            />
            <input
              type="datetime-local"
              value={datetime}
              onChange={ev => setDatetime(ev.target.value)}
              required
            />
          </div>
          <div className="description">
            <input
              type="text"
              placeholder="description"
              value={description}
              onChange={ev => setDescription(ev.target.value)}
              required
            />
            <input
              type="number"
              value={price}
              onChange={ev => setPrice(ev.target.value)}
              placeholder="price +500"
              required
            />
          </div>
          <button type="submit">Add new transaction</button>
        </form>

        <div className="transactions">
          {transactions.map((t, index) => (
            <div className="transaction" key={index}>
              <div className="left">
                <div className="name">{t.name}</div>
                <div className="description">{t.description}</div>
              </div>
              <div className="right">
                <div className={`price ${t.price < 0 ? 'red' : 'green'}`}>
                  {t.price < 0 ? '-' : '+'}${Math.abs(t.price)}
                </div>
                <div className="description">
                  {new Date(t.datetime).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
