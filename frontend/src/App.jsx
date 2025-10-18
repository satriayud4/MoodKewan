import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import './styles/App.css';

function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(false);

  // Check backend status saat app dimulai
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/health');
      setBackendStatus(response.data.model_loaded);
    } catch (err) {
      console.log('Backend tidak terhubung');
      setBackendStatus(false);
    }
  };

  const handleImageSelect = (file) => {
    setImage(file);
    setResult(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!image) {
      setError('Pilih gambar terlebih dahulu');
      return;
    }

    if (!backendStatus) {
      setError('Backend tidak terhubung. Pastikan Flask app berjalan di http://localhost:5000');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi error saat prediksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🐾 MoodKewan</h1>
        <p>Deteksi emosi hewan peliharaan Anda dengan AI</p>
        <div className={`status ${backendStatus ? 'connected' : 'disconnected'}`}>
          {backendStatus ? '✓ Backend Connected' : '✗ Backend Disconnected'}
        </div>
      </header>

      <main className="container">
        <ImageUploader onImageSelect={handleImageSelect} image={image} />

        {error && <div className="error-message">{error}</div>}

        {image && (
          <button
            className="predict-btn"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? 'Prediksi sedang berjalan...' : 'Prediksi Emosi'}
          </button>
        )}

        {result && <ResultDisplay result={result} />}
      </main>

      <footer className="footer">
        <p>MoodKewan © 2025 | Prediksi Emosi Hewan Menggunakan AI</p>
      </footer>
    </div>
  );
}

export default App;