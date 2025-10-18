import React from 'react';

function ResultDisplay({ result }) {
  if (!result) return null;

  const emotion = result.emotion;
  const confidence = (result.confidence * 100).toFixed(2);
  const allScores = result.all_scores;

  // Emoji untuk setiap emosi
  const emotionEmoji = {
    'Angry': '😠',
    'Sad': '😢',
    'Happy': '😊',
    'Other': '🤷'
  };

  const getEmotionColor = (em) => {
    const colors = {
      'Angry': '#FF6B6B',
      'Sad': '#4ECDC4',
      'Happy': '#FFD93D',
      'Other': '#95E1D3'
    };
    return colors[em] || '#999';
  };

  return (
    <div className="result-container">
      <div className="main-result">
        <div className="emoji-display">
          {emotionEmoji[emotion]}
        </div>
        
        <h2 className="emotion-title">
          {emotion}
        </h2>
        
        <div className="confidence-display">
          <span className="confidence-label">Tingkat Keyakinan:</span>
          <span className="confidence-value">{confidence}%</span>
        </div>

        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{
              width: `${confidence}%`,
              backgroundColor: getEmotionColor(emotion)
            }}
          />
        </div>
      </div>

      <div className="all-scores">
        <h3>Semua Prediksi:</h3>
        <div className="scores-grid">
          {Object.entries(allScores).map(([emotionName, score]) => (
            <div key={emotionName} className="score-item">
              <div className="score-header">
                <span className="score-emoji">
                  {emotionEmoji[emotionName]}
                </span>
                <span className="score-name">{emotionName}</span>
              </div>
              
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${score * 100}%`,
                    backgroundColor: getEmotionColor(emotionName)
                  }}
                />
              </div>
              
              <span className="score-percentage">
                {(score * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay;