import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  useToast,
  VStack,
  HStack,
  Text,
  IconButton,
  Center,
  FormLabel,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [descriptionColumn, setDescriptionColumn] = useState('Text');
  const [challengeName, setChallengeName] = useState('Text');
  const [solutionName, setSolutionName] = useState('Solution');
  const toast = useToast();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('description', descriptionColumn);
    formData.append('challenge', challengeName);
    formData.append('solution', solutionName);

    try {
      // Send the POST request with form data
      await axios.post('http://localhost:8000/upload_docs/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Set content type for file upload
        },
    });
     
    
      toast({
        title: 'File Uploaded.',
        description: `File ${selectedFile.name} uploaded successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Reset fields after successful upload
      setCategory('');
      setDescriptionColumn('');
      setChallengeName('');
      setSolutionName('');
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: 'Error uploading file.',
        description: error.message || 'An unknown error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center>
      <Box maxW="lg" overflow="hidden" p={6}>
        <Text fontSize="2xl" mb={6}>Upload your documents</Text>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            
            <Box>
              <FormLabel htmlFor="category">Category</FormLabel>
              <Input
                id="category"
                placeholder="Enter Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Box>
            <Box>
              <FormLabel htmlFor="file-upload">Upload File</FormLabel>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                variant="filled"
                accept="*"
                icon={<AddIcon />}
                color="black"
              />
            </Box>
            {selectedFile && (
              <HStack>
                <Text>{selectedFile.name}</Text>
                <IconButton
                  icon={<CloseIcon />}
                  isRound
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  aria-label="Remove File"
                />
              </HStack>
            )}
            <Box>
              <FormLabel htmlFor="description-column">Description Column Name</FormLabel>
              <Input
                id="description-column"
                placeholder="Text"
                value={descriptionColumn}
                onChange={(e) => setDescriptionColumn(e.target.value)}
              />
            </Box>
            
            <HStack spacing={4}>
              <Box flex="1">
                <FormLabel htmlFor="challenge-name">Challenge Name</FormLabel>
                <Input
                  id="challenge-name"
                  placeholder="Text"
                  value={challengeName}
                  onChange={(e) => setChallengeName(e.target.value)}
                />
              </Box>
              <Box flex="1">
                <FormLabel htmlFor="solution-name">Solution Name</FormLabel>
                <Input
                  id="solution-name"
                  placeholder="Solution"
                  value={solutionName}
                  onChange={(e) => setSolutionName(e.target.value)}
                />
              </Box>
            </HStack>
            <Button
              type="submit"
              bg="blanchedalmond" color="black"
              isFullWidth
              isDisabled={!selectedFile || isLoading}
              isLoading={isLoading}
            >
              Upload
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default FileUpload;