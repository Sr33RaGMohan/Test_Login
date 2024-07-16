import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchQuestions, Question } from '../utils/fetchQuestions';
import '../css/TestPage.css';
import { useNavigate } from 'react-router-dom';

interface UserAnswers {
  [key: number]: string[];
}

interface NotepadValues {
  [key: number]: string;
}

const TestPage: React.FC = () => {
  const { category, setResults } = useAppContext();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [notePadValues,setNotepadValues] = useState<NotepadValues>({});

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchQuestions(category);
      setQuestions(fetchedQuestions);
    };
    loadQuestions();
    startTimer();
  }, [category]);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const startTimer = (): void => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setTotalTimeTaken((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = (): void => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNextQuestion = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(300);
    }
  };

  const handlePreviousQuestion = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setTimeLeft(300);
    }
  };

  const handleAnswerChange = (questionId: number, option: string): void => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]:  [option],
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

    return { correct, wrong, skipped, score: correct * 10 };
  };

  const handleSubmit = (): void => {
    setIsModalOpen(true);
  };

  const handleNotepadChange = (questionId: number, value: string): void => {
    setNotepadValues((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const confirmSubmit = (): void => {
    stopTimer();
    const { correct, wrong, skipped, score } = calculateResults();
    const results = {
      score,
      correct,
      wrong,
      skipped,
      timeTaken: formatTime(totalTimeTaken),
      notes:notePadValues,
    };
    setResults(results);
    setIsModalOpen(false);
    navigate('/results');
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

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
            <ul className='option-list'>
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
              <button 
                className="exit-button" 
                onClick={handlePreviousQuestion} 
                disabled={currentQuestionIndex === 0}
              >
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
          <textarea
            className="notepad-input"
            value={notePadValues[currentQuestionIndex] || ''}
            onChange={(e) => handleNotepadChange(currentQuestionIndex, e.target.value)}
            placeholder="Your scribble notes here..."
          />
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
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Submission</h2>
            <p>Are you sure you want to submit the exam ?</p>
            <div className="modal-buttons">
              <button onClick={confirmSubmit}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;