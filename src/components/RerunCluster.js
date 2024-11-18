import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Select, Text, Spinner, Alert } from '@chakra-ui/react';
import axios from 'axios';

const RerunCluster = () => {
    const [categories, setCategories] = useState([]);
    const [runName, setRunName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [numClusters, setNumClusters] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/get-category-names/');
                setCategories(response.data.map(category => ({ value: category, label: category })));
            } catch (error) {
                console.error('Error fetching categories:', error);
                setErrorMessage('Failed to fetch categories.');
            }
        };
        fetchCategories();
    }, []);

    // Function to handle rerun cluster
    const handleRerunCluster = async () => {
        if (!runName || !selectedCategory) {
            setErrorMessage('Please enter a run name and select a category.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await axios.post('http://127.0.0.1:8000/rerun-cluster', {
                run_name: runName,
                category_name: selectedCategory,
                num_clusters: numClusters,
            });
            setSuccessMessage('Cluster rerun initiated successfully.');
        } catch (error) {
            console.error('Error rerunning cluster:', error);
            setErrorMessage('Failed to initiate cluster rerun.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={5}>
            <Text fontSize="2xl" mb={4}>Rerun Cluster</Text>

            {errorMessage && <Alert 
            color = "black" status="error">{errorMessage}</Alert>}
            {successMessage && <Alert 
            color = "black" status="success">{successMessage}</Alert>}

            <Input
                placeholder="Enter Run Name"
                value={runName}
                onChange={(e) => setRunName(e.target.value)}
                mb={4}
            />

            <Select
                placeholder="Select a Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                mb={4}
                bg="white"
                color="black"
            >
                {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                ))}
            </Select>

            <Select
                placeholder="Number of Clusters"
                value={numClusters}
                onChange={(e) => setNumClusters(e.target.value)}
                mb={4}
                bg="white"
                color="black"
            >
                {[1, 2, 3, 4, 5,
                6,7,8,9,10,11,12,
                13,14,15,16,17,18,
                19,20].map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </Select>

            <Button
                colorScheme="teal"
                onClick={handleRerunCluster}
                isLoading={loading}
            >
                Rerun Cluster
            </Button>
        </Box>
    );
};

export default RerunCluster;