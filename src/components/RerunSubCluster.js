import React, { useEffect, useState } from 'react';
import { Box, Button, Select, Text, Spinner, Alert } from '@chakra-ui/react';
import axios from 'axios';

const RerunSubCluster = () => {
    const [categories, setCategories] = useState([]);
    const [runNames, setRunNames] = useState([]);
    const [selectedRun, setSelectedRun] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [numClusters, setNumClusters] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loadingRuns, setLoadingRuns] = useState(true);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/get-category-names/');
                const fetchedCategories = response.data.map(category => ({ value: category, label: category }));
                setCategories(fetchedCategories);

                // Automatically select the first category if available
                if (fetchedCategories.length > 0) {
                    setSelectedCategory(fetchedCategories[0].value);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setErrorMessage('Failed to fetch categories.');
            }
        };
        fetchCategories();
    }, []);

    // Fetch RUN names based on selected category
    useEffect(() => {
        if (!selectedCategory) return; // Prevent fetching if no category is selected

        const fetchRunNames = async () => {
            setLoadingRuns(true);
            try {
                const response = await axios.post('http://127.0.0.1:8000/get-run-names-for-category/', {
                    category_name: selectedCategory,
                });
                if(response.data)
                {
                    setRunNames(response.data.map(run => ({ value: run, label: run })));
                }
                
            } catch (error) {
                console.error('Error fetching run names:', error);
                setErrorMessage('Failed to fetch run names.');
            } finally {
                setLoadingRuns(false);
            }
        };

        fetchRunNames();
    }, [selectedCategory]);

    // Handle rerun action
    const handleRerun = async () => {
        if (!selectedRun || !selectedCategory || !numClusters) {
            setErrorMessage('Please select all fields before proceeding.');
            return;
        }

        setLoading(true);
        try {
            // Replace with your actual rerun logic
            await axios.post('http://127.0.0.1:8000/rerun-sub-cluster/', {
                category: selectedCategory,
                run: selectedRun,
                clusters: numClusters,
            });
            setSuccessMessage('Sub Cluster rerun successfully!');
        } catch (error) {
            console.error('Error during rerun:', error);
            setErrorMessage('Failed to rerun sub cluster.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={5}>
            <Text fontSize="2xl" mb={4}>Rerun Sub Cluster</Text>

            {errorMessage && <Alert color="black" status="error">{errorMessage}</Alert>}
            {successMessage && <Alert color="black" status="success">{successMessage}</Alert>}

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

            {loadingRuns ? (
                <Spinner />
            ) : (
                <Select
                    placeholder="Select a Run"
                    value={selectedRun}
                    onChange={(e) => setSelectedRun(e.target.value)}
                    mb={4}
                    bg="white"
                    color="black"
                >
                    {runNames.map(run => (
                        <option key={run.value} value={run.value}>{run.label}</option>
                    ))}
                </Select>
            )}

            <Select
                placeholder="Number of Clusters"
                value={numClusters}
                onChange={(e) => setNumClusters(e.target.value)}
                mb={4}
                bg="white"
                color="black"
            >
                {[...Array(20).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                ))}
            </Select>

            <Button
                colorScheme="teal"
                isLoading={loading}
                onClick={handleRerun}
            >
                Rerun Sub Cluster
            </Button>
        </Box>
    );
};

export default RerunSubCluster;