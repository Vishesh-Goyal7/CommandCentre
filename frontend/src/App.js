import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";
import Notes from "./pages/Notes";
import Projects from "./pages/Projects";
import Events from "./pages/Events";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        <Route path="/notes" element={ <ProtectedRoute> <Notes /> </ProtectedRoute> } />
        <Route path="/projects" element={ <ProtectedRoute> <Projects /> </ProtectedRoute> } />
        <Route path="/events" element={ <ProtectedRoute> <Events /> </ProtectedRoute> } />
      </Routes>
    </Router>
  );
}

export default App;
