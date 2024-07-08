import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchQuestions, Question } from '../utils/fetchQuestions';
import '../css/TestPage.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const TestPage: React.FC = () => {
  const { category,  setResults } = useAppContext(); // Include setCategory from context
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // Example 5-minute timer for each question
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string[] }>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchedQuestions = fetchQuestions(category);
    setQuestions(fetchedQuestions);
  }, [category]);

  useEffect(() => {
    if (questions.length > 0) {
      startTimer();
    }
    return () => stopTimer();
  }, [currentQuestionIndex]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        return 0;
      });
      setTotalTimeTaken((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(300); // Reset the timer for the next question
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeLeft(300); // Reset the timer for the previous question
    }
  };

  const handleAnswerChange = (questionId: number, option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId] ? [...prev[questionId], option] : [option],
    }));
  };

  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index] || [];
      const correctAnswer = question.options.find(opt => opt.id === question.correct_option)?.value || '';

      if (userAnswer.length === 0) {
        skipped++;
      } else if (userAnswer.includes(correctAnswer)) {
        correct++;
      } else {
        wrong++;
      }
    });

    return { correct, wrong, skipped, score: correct * 10 }; // Assuming each correct answer gives 10 points
  };


  const handleSubmit = () => {
    stopTimer();
    const { correct, wrong, skipped, score } = calculateResults();
    const results = {
      score,
      correct,
      wrong,
      skipped,
      timeTaken: formatTime(totalTimeTaken),
    };
    console.log("Setting results:", results);
    setResults(results);
    navigate('/results');
  };


  if (questions.length === 0) {
    return <div>No questions available for the selected category.</div>;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="test-page">
      <header>
        <div className="logo">CLINICAL SCHOLAR</div>
        <div className="exam-category">EXAM CATEGORY: {category.toUpperCase()}</div>
        <div className="header-icons">
          <span className="icon">☰</span>
        </div>
      </header>
      <main>
        <div className="question-container">
          <div className="timer">{formatTime(timeLeft)}</div>
          <div className="question-content">
            <h2>Question {currentQuestionIndex + 1} / {questions.length}</h2>
            <p>{questions[currentQuestionIndex].question}</p>
            <ul>
              {questions[currentQuestionIndex].options.map((option) => (
                <li key={option.id}>
                  <label>
                    <input
                      type="checkbox"
                      className="option"
                      onChange={() => handleAnswerChange(currentQuestionIndex, option.value)}
                      checked={userAnswers[currentQuestionIndex]?.includes(option.value) || false}
                    />
                    {option.value}
                  </label>
                </li>
              ))}
            </ul>
            <div className="button-container">
              <button className="exit-button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button className="next-button" onClick={handleNextQuestion}>
                  Next
                </button>
              ) : (
                <button className="next-button" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="notepad">
          <h3>Notepad</h3>
          <div className="notepad-placeholder">Your scribble notes here...</div>
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

export default TestPage;
