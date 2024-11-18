import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Home from './pages/Home';
import ClusterInfo from './pages/ClusterInfo';  // New page for detailed info
import ClusterCounts from './components/ClusterCounts';  // New page for detailed info
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Import the Header component
import Subheader from './components/SubHeader'; // Import the Header component
import RerunCluster from './components/RerunCluster';
import RerunSubCluster from './components/RerunSubCluster';
import RunCluster from './components/RunCluster';

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Router>
                <Header /> {/* Include the Header here */}
                <Subheader />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/run-cluster" element={<RunCluster />} />
                    <Route path="/rerun-cluster" element={<RerunCluster />} />
                    <Route path="/rerun-subcluster" element={<RerunSubCluster />} />
                    <Route path="/cluster-info" element={<ClusterInfo />} />
                    <Route path="/cluster-stats" element={<ClusterCounts />} />
                    <Route path="/cluster-info/:clusterName" element={<ClusterInfo />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;