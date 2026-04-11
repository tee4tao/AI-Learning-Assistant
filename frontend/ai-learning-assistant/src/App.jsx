import React from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DocumentListPage from './pages/documents/DocumentListPage';
import DocumentDetailPage from './pages/documents/DocumentDetailPage';
import FlashcardListPage from './pages/flashcards/FlashcardListPage';
import FlashcardPage from './pages/flashcards/FlashcardPage';
import QuizTakePage from './pages/quizzes/QuizTakePage';
import QuizResultPage from './pages/quizzes/QuizResultPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
 const isAuthenticated = false;
 const loading = false;

 if (loading) {
  return (
    <div className='flex items-center justify-center h-screen'>
      <p>Loading...</p>
    </div>
  )
 }

 return(
 <BrowserRouter>
   <Routes>
     <Route path="/" element={isAuthenticated? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace /> } />
     <Route path="/login" element={<LoginPage/>} />
     <Route path="/register" element={<RegisterPage/>} />

     <Route element={<ProtectedRoute />} >
       <Route path="/dashboard" element={<DashboardPage />} />
       <Route path="/documents" element={<DocumentListPage />} />
       <Route path="/documents/:id" element={<DocumentDetailPage />} />
       <Route path="/flashcards" element={<FlashcardListPage />} />
       <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
       <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
       <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
       <Route path="/profile" element={<ProfilePage />} />
     </Route>
     <Route path="*" element={<NotFoundPage/>} />
   </Routes>
 </BrowserRouter>
 )
}

export default App