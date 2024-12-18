import React from 'react';
import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <Box bg="black" color="white" p={4}>
            <Flex alignItems="center" justifyContent="space-between">
                <Heading size="md">ITSM Analyzer</Heading>
                <Flex>
               
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;