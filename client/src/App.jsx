import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SSOCallback from './pages/SSOCallback';
import PendingApproval from './pages/PendingApproval';
import Layout from './Layout';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import CategoryDetail from './pages/CategoryDetail';
import Stats from './pages/Stats';
import Admin from './pages/Admin';
import AddArticle from './pages/AddArticle';
import ArticleDetail from './pages/ArticleDetail';
import SearchResults from './pages/SearchResults';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      <Route path="/sso-callback" element={<SSOCallback />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/add-article" element={<AddArticle />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
