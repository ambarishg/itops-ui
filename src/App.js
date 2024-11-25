import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Home from './pages/Home';
import ClusterInfo from './pages/ClusterInfo';
import ClusterCounts from './components/ClusterCounts';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Subheader from './components/SubHeader';
import RerunCluster from './components/RerunCluster';
import RerunSubCluster from './components/RerunSubCluster';
import RunCluster from './components/RunCluster';
import FileUpload from './components/UploadDocs';
import { ClerkProvider, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import LandingPage  from './pages/LandingPage';



const ProtectedRoute = ({ children }) => {
    const { isSignedIn } = useUser();

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return children;
};
// Replace with your actual frontend API and API key
const publishableKey= 'pk_test_d2l0dHktY29sbGllLTM0LmNsZXJrLmFjY291bnRzLmRldiQ';
function App() {
    
    return (
        <ClerkProvider frontendAPI
        publishableKey={publishableKey}>
            <ChakraProvider theme={theme}>
                <Router>
                    <Header />
                    <Subheader />
                    <Routes>
                        <Route path="/sign-in/*" element={<SignIn />} />
                        <Route path="/sign-up/*" element={<SignUp />} />
                        <Route path="/" element={
                                <LandingPage />} />
                        <Route path="/cluster-counts" element={
                            <ProtectedRoute>
                                <Home />
                                </ProtectedRoute>} />
                        <Route path="/file-upload" element={
                             <ProtectedRoute><FileUpload /></ProtectedRoute>
                             } />
                        <Route path="/run-cluster" element={
                              <ProtectedRoute><RunCluster /></ProtectedRoute>
                            
                            } />
                        <Route path="/rerun-cluster" element={
                        <ProtectedRoute>
                            <RerunCluster />
                        </ProtectedRoute>} />
                        <Route path="/rerun-subcluster" element={
                            <ProtectedRoute>
                                <RerunSubCluster />
                            </ProtectedRoute>} />
                        <Route path="/cluster-info" 
                        element={
                            <ProtectedRoute>
                                <ClusterInfo />
                            </ProtectedRoute>} />
                        <Route path="/cluster-stats" element={<ClusterCounts />} />
                        <Route path="/cluster-info/:clusterName" element={<ClusterInfo />} />
                        
                        {/* Add a route for protected pages */}
                        <Route path="/protected" element={
                            // Redirect to sign-in if not authenticated
                            <RedirectToSignIn />
                        } />
                    </Routes>
                </Router>
            </ChakraProvider>
        </ClerkProvider>
    );
}

export default App;