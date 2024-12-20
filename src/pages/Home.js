// src/pages/Home.js
import React from 'react';
import { Box } from '@chakra-ui/react';
import ClusterCounts from '../components/ClusterCounts';


const Home = () => {
    return (
        <Box padding="20px"> {/* Changed background color for better contrast */}
            <ClusterCounts />
        </Box>
    );
};

export default Home;