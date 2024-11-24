import React from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const Subheader = () => {
    return (
        <Box bg="gray.100" p={4} color = "black">
            <Flex justifyContent="center">
                <Link as={NavLink} to="/" exact style={{ margin: '0 15px' }} activeStyle={{ fontWeight: 'bold', color: 'teal' }}>
                    Home
                </Link>
                <Link as={NavLink} to="/file-upload" style={{ margin: '0 15px' }} activeStyle={{ fontWeight: 'bold', color: 'teal' }}>
                    Upload Docs
                </Link>
                <Link as={NavLink} to="/run-cluster" style={{ margin: '0 15px' }} activeStyle={{ fontWeight: 'bold', color: 'teal' }}>
                    Run Cluster
                </Link>
                <Link as={NavLink} to="/rerun-cluster" style={{ margin: '0 15px' }} activeStyle={{ fontWeight: 'bold', color: 'teal' }}>
                    Rerun Cluster
                </Link>
            </Flex>
        </Box>
    );
};

export default Subheader;