import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../css/ResultsPage.css';

const ResultPage: React.FC = () => {
  const { results, category } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Results in ResultPage:', results); // Log the results
    if (!results) {
      console.error('No results available');
      // Optionally, you can redirect to the test page or show an error message
      // navigate('/test');
    }
  }, [results, navigate]);

  if (!results) {
    return <div>No results available. Please take the test first.</div>;
  }

  const { score, correct, wrong, skipped, timeTaken } = results;
  const totalQuestions = correct + wrong + skipped;
  const scorePercentage = (score / (totalQuestions * 10)) * 100;

  return (
    <div className="result-page">
      <header>
        <div className="logo">CLINICAL SCHOLAR</div>
        <div className="exam-category">EXAM CATEGORY: {category.toUpperCase()}</div>
        <div className="header-icons">
          <span className="icon">☰</span>
        </div>
      </header>
      <main>
        <div className="result-container">
          <div className="score-summary">
            <p>Score : {score} / {totalQuestions * 10}</p>
            <p>Time Taken : {timeTaken}</p>
          </div>
          <div className="score-details">
            <div className="total-score">
              <div className="gauge-chart">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray={`${scorePercentage}, 100`}
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">{scorePercentage.toFixed(0)}%</text>
                </svg>
              </div>
              <p>Total Score</p>
            </div>
            <div className="other-scores">
              <div className="score-item">
                <div className="gauge-chart">
                  <svg viewBox="0 0 36 36" className="circular-chart blue">
                    <path className="circle-bg" d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${(score / (totalQuestions * 10)) * 100}, 100`}
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">{score}</text>
                  </svg>
                </div>
                <p>Final Score</p>
              </div>
              <div className="score-item">
                <div className="gauge-chart">
                  <svg viewBox="0 0 36 36" className="circular-chart green">
                    <path className="circle-bg" d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${(correct / totalQuestions) * 100}, 100`}
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">{correct}</text>
                  </svg>
                </div>
                <p>Correct</p>
              </div>
              <div className="score-item">
                <div className="gauge-chart">
                  <svg viewBox="0 0 36 36" className="circular-chart red">
                    <path className="circle-bg" d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${(wrong / totalQuestions) * 100}, 100`}
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">{wrong}</text>
                  </svg>
                </div>
                <p>Wrong</p>
              </div>
              <div className="score-item">
                <div className="gauge-chart">
                  <svg viewBox="0 0 36 36" className="circular-chart gray">
                    <path className="circle-bg" d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${(skipped / totalQuestions) * 100}, 100`}
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">{skipped}</text>
                  </svg>
                </div>
                <p>Skipped</p>
              </div>
            </div>
          </div>
          <div className="notes-section">
            <h3>Your scribble notes:</h3>
            <div className="notes-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nisl vitae purus facilisi id. Blandit sagittis commodo,
              urna ut mattis vestibulum non. Vel sed scelerisque leo quis in mattis ultrices aliquam. Justo,Lorem ivp
            </div>
          </div>
          <button className="exit-button">Exit</button>
        </div>
      </main>
      <footer>
        <div className="logo">CLINICAL SCHOLAR</div>
        <div className="social-icons">
          <span className="icon">f</span>
          <span className="icon">t</span>
          <span className="icon">▶</span>
          <span className="icon">◯</span>
        </div>
        <div className="copyright">
          © Copyright Clinical Scholar | Powered by Quinoid Business Solutions
        </div>
      </footer>
    </div>
  );
};

export default ResultPage;