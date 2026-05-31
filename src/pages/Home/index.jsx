// Module CSS
import S from './style.module.css';
// Libraries
import { useState } from 'react';
import axios from 'axios';

const { VITE_SERVER_URL } = import.meta.env;

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await axios.get(`${VITE_SERVER_URL}/api/vast`);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={S.page}>
      <button className={S.btn} onClick={handleFetch} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Vast AI User'}
      </button>
      {error && <p className={S.error}>{error}</p>}
      {data && <pre className={S.response}>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Home;
