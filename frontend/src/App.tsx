import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VocabularyPage from "./pages/VocabularyPage";
import GrammarPage from "./pages/GrammarPage";
import GrammarDetailPage from "./pages/GrammarDetailPage";
import ListeningPage from "./pages/ListeningPage";
import SpeakingPage from "./pages/SpeakingPage";
import ListeningPracticePage from "./pages/ListeningPracticePage";
import ProfilePage from "./pages/ProfilePage";
import LessonDetailPage from "./pages/LessonDetailPage";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import GrammarExercisePage from "./pages/GrammarExercisePage";
import TestListPage from "./pages/TestListPage";
import TakeTestPage from "./pages/TakeTestPage";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { Navigate } from "react-router-dom";

// Admin imports
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminLevelsPage } from "./pages/admin/AdminLevelsPage";
import { AdminTopicsPage } from "./pages/admin/AdminTopicsPage";
import { AdminLessonsPage } from "./pages/admin/AdminLessonsPage";
import { AdminVocabularyPage } from "./pages/admin/AdminVocabularyPage";
import { AdminGrammarPage } from "./pages/admin/AdminGrammarPage";
import { AdminSentencesPage } from "./pages/admin/AdminSentencesPage";
import { AdminTestsPage } from "./pages/admin/AdminTestsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/vocabulary"
        element={
          <ProtectedRoute>
            <VocabularyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grammar"
        element={
          <ProtectedRoute>
            <GrammarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grammar/:id"
        element={
          <ProtectedRoute>
            <GrammarDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grammar-exercise/:id"
        element={
          <ProtectedRoute>
            <GrammarExercisePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/listening"
        element={
          <ProtectedRoute>
            <ListeningPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/speaking"
        element={
          <ProtectedRoute>
            <SpeakingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice/:id"
        element={
          <ProtectedRoute>
            <ListeningPracticePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lessons/:id"
        element={
          <ProtectedRoute>
            <LessonDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tests"
        element={
          <ProtectedRoute>
            <TestListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/take-test/:id"
        element={
          <ProtectedRoute>
            <TakeTestPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/levels" replace />} />
        <Route path="levels" element={<AdminLevelsPage />} />
        <Route path="topics" element={<AdminTopicsPage />} />
        <Route path="lessons" element={<AdminLessonsPage />} />
        <Route path="sentences" element={<AdminSentencesPage />} />
        <Route path="vocabulary" element={<AdminVocabularyPage />} />
        <Route path="grammar" element={<AdminGrammarPage />} />
        <Route path="tests" element={<AdminTestsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
};

export default App;
