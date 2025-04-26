import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';


const AppRoutes: React.FC = () => {
  return (
    <Router>
       <Routes>
       <Route path="/" element={<LoginPage/>} />
        <Route path="/test" element={<TestPage/> } />
        <Route path="/results" element={<ResultsPage/>} />
       </Routes>
    </Router>
  );
};

export default AppRoutes;
