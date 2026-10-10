import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import JobCarousel from './Components/JobCarousel';
import ProtectedRoute from './Components/ProtectedRoute';
import EmployerDashboard from './Components/EmployerDashboard';
import PostJob from './Components/PostJob';
import MyJobs from './Components/MyJobs';
import JobSeekerJobs from './Components/JobSeekerJobs';
import './App.css';
import ContactSection from './Components/ContactSection';

function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section className="jobs-carousel-section" id="jobs">
          <JobCarousel />
        </section>
        <ContactSection />
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route
          path="/employer/post-job"
            element={
              <ProtectedRoute role="EMPLOYER">
                <PostJob />
              </ProtectedRoute>
            }
      />
      <Route path="/" element={<Landing />} />
      <Route path="/employer/dashboard" element={<ProtectedRoute role="EMPLOYER"><EmployerDashboard /></ProtectedRoute>} />
      <Route path="/employer/jobs/:id/edit" element={<ProtectedRoute role="EMPLOYER"><PostJob /></ProtectedRoute>} />
      <Route path="/employer/jobs" element={<ProtectedRoute role="EMPLOYER"><MyJobs /></ProtectedRoute>} />
      <Route path="/job-seeker/jobs" element={<ProtectedRoute role="APPLICANT"><JobSeekerJobs /></ProtectedRoute>} />
      <Route path="/job-seeker/dashboard" element={<ProtectedRoute role="APPLICANT"><JobSeekerJobs /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
