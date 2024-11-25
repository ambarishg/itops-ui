// src/LandingPage.js
import React from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    SimpleGrid,
    Card,
    CardBody,
} from '@chakra-ui/react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const functionalities = [
    {
        title: "Upload Docs",
        description: "Easily upload documents for processing and analysis. Segregate the documents into different categories of your choice.",
    },
    {
        title: "Create Groups",
        description: "Create groups of similar items in a document easily. E.g. For Complaints / Tickets, create 8 groups of Complaints and Tickets which share the same characteristics",
    },
    {
        title: "Rerun Create Group",
        description: "Rerun a previously created group with updated parameters.",
    },
    {
        title: "Group Counts",
        description: "View the total number of items in the groups and also subgroup the existing group.",
    },
    {
      title: "Challenges and Solutions",
      description: "View the challenges and solutions of the group",
   },
];

const LandingPage = () => {
  return (
    <Box
      minH="10vh" // Changed to 100vh to take full height
      bg="black"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      color="white"
      px={6}
      py={8}
    >
        <VStack spacing={6}>
          <Heading as="h1" size="xl" fontWeight="bold">
            Welcome to Problem Assistant 
          </Heading>

          <SignedIn>
            <Text>You are signed in.</Text>
            {/* Add any authenticated content here */}
          </SignedIn>

          <SignedOut>
            <Text>Please sign in to access more features.</Text>
          </SignedOut>

          {/* Centering the SimpleGrid */}
          <Box width="100%" display="flex" justifyContent="center">
            <SimpleGrid columns={{ base: 1, md: 2 , lg: 3 }} spacing={8} mt={8}> {/* Increased maxWidth */}
              {functionalities.map((func, index) => (
                <Card key={index} bg="gray.800" 
                borderRadius="md" 
                width={{ base: "95%", sm: "90%", md: "100%" }} 
                p={6}> {/* Increased width and padding */}
                  <CardBody color="white">
                    <Heading as="h3" size="md" mb={2}>
                      {func.title}
                    </Heading>
                    <Text>{func.description}</Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
    </Box>
  );
};

export default LandingPage;