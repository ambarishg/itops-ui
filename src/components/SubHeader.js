import React from 'react';
import { Box, Flex, Link, Button, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

const Subheader = () => {
    const { user, isSignedIn, isLoaded } = useUser(); // Access user data
    const { signOut } = useClerk(); // Access sign out function

    return (
        <Box bg="gray.100" p={4} color="black">
            <Flex justifyContent="space-between" alignItems="center">
                {/* Centered Links */}
                <Flex justifyContent="center" flexGrow={1}>
                <Link as={NavLink} to="/" style={{ margin: '0 15px' }} activeStyle={{ fontWeight: 'bold', color: 'teal' }}>
                        Home
                </Link>
                <Link as={NavLink} to="/file-upload" style={{ margin: '0 15px' }} activeStyle={{ fontWeight: 'bold', color: 'teal' }}>
                        Upload Docs
                </Link>
                <Link as={NavLink} to="/cluster-counts" exact style={{ margin: '0 15px' }} activeStyle={{ fontWeight: 'bold', color: 'teal' }}>
                        Cluster Counts
                </Link>
                    
                <Link as={NavLink} to="/run-cluster" style={{ margin: '0 15px' }} activeStyle={{ fontWeight: 'bold', color: 'teal' }}>
                        Create Groups
                </Link>
                <Link as={NavLink} to="/rerun-cluster" style={{ margin: '0 15px' }} activeStyle={{ fontWeight: 'bold', color: 'teal' }}>
                        Rerun Create Group
                </Link>
                </Flex>
                {/* User Info */}
                <Flex alignItems="center">
                    {isLoaded && isSignedIn ? (
                        <>
                            <Text mr={4}>Welcome, {user.firstName}!</Text>
                            <Button colorScheme="red" onClick={() => signOut()}>
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <Text>
                            <NavLink to="/sign-in" style={{ color: 'teal', textDecoration: 'underline' }}>Sign In</NavLink>
                        </Text>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Subheader;