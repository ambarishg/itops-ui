import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Select,
    Text,
    VStack,
    Alert,
    AlertIcon,
    Spinner,
    SimpleGrid,
    Card,
    CardHeader,
    CardBody,
    IconButton,
} from '@chakra-ui/react';
import { AddIcon, InfoIcon } from '@chakra-ui/icons'; // Importing Add and Info icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

const ClusterCounts = () => {
    const [runNames, setRunNames] = useState([]); // State for storing run names
    const [selectedRunName, setSelectedRunName] = useState(''); // State for selected run name
    const [clusterCounts, setClusterCounts] = useState([]); // Initialize as an empty array
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // Initialize the navigate hook
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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

    // Fetch cluster counts whenever selectedRunName changes
    useEffect(() => {
        if (selectedRunName) {
            fetchClusterCounts(); // Fetch cluster counts when selectedRunName is updated
        }
    }, [selectedRunName]); // Dependency array includes selectedRunName

    const fetchClusterCounts = async () => {
        setLoading(true);
        setError('');
        console.log('Fetching cluster counts for:', selectedRunName); // Log current selected run name
        try {
            const response = await axios.post('http://127.0.0.1:8000/cluster-counts/', {
                run_name: selectedRunName,
            });
            console.log('Fetched cluster counts:', response.data); // Log fetched cluster counts

            if (Array.isArray(response.data)) {
                setClusterCounts(response.data); // Set cluster counts directly
            } else {
                setError('Unexpected data format for cluster counts');
            }
        } catch (err) {
            if (err.response) {
                setError(`Error: ${err.response.data.message || 'Unable to fetch data'}`);
            } else if (err.request) {
                setError('Network error: Please check your connection.');
            } else {
                setError('An unexpected error occurred.');
            }
            setClusterCounts([]); // Reset cluster counts on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedRunName.trim()) {
            setError('Please select a Run Name');
            return;
        }
        fetchClusterCounts();  // This will now be handled by the effect above
    };

    const handleDrillDown = async (e,clusterName) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/get-run-name-for-drill-down/', {
                cluster_name: clusterName,
            });

            if (response.data && response.data.run_name) {
                setSelectedRunName(response.data.run_name);
            } else {
                console.log('No run name found.');
            }
        } catch (err) {
            setError('Error fetching run name: ' + err.message);
        }
    };

    const handleInfoClick = (clusterName, runName) => {
        console.log(`Showing info for ${clusterName} in run ${runName}`);
        // Navigate to the Cluster Info page with both cluster and run names
        navigate(`/cluster-info/${clusterName}?run=${runName}`);
    };

    return (
        <VStack spacing={4} align="stretch">
            <br/>
            <Text fontSize="2xl">Get Cluster Counts</Text>
            <form onSubmit={handleSubmit}>

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
                    placeholder="Select the Run"
                    value={selectedRunName}
                    onChange={(e) => setSelectedRunName(e.target.value)}
                    mb={4}
                    bg="white"
                    color="black"
                    sx={{
                        bg: 'white',
                        color: 'black',
                        '&:focus': { bg: 'white', color: 'black' },
                        '& option': { color: 'black' },
                        '&[aria-selected]': { bg: 'white', color: 'black' },
                    }}
                >
                    {runNames.map(run => (
                        <option key={run.value} value={run.value}>{run.label}</option>
                    ))}
                </Select>
            )}
                    <Button type="submit" colorScheme="teal" mt={4} isDisabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Get Cluster Counts'}
                </Button>
            </form>

            {error && (
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {clusterCounts.length > 0 && (
                <Box mt={4}>
                    <Text fontSize="xl" mb={2}>Results for Run: <strong>{selectedRunName}</strong></Text>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {clusterCounts.map((cluster) => (
                            <Card key={cluster.CLUSTER_NAMES} borderWidth="1px" borderRadius="lg" overflow="hidden">
                                <CardHeader bg="teal.100" color="black" p={4} display="flex" justifyContent="space-between">
                                    <Text>{cluster.CLUSTER_NAMES}</Text>
                                    {/* First IconButton for adding or drilling down */}
                                    <IconButton 
                                        aria-label={`Add or drill down into ${cluster.CLUSTER_NAMES}`} 
                                        icon={<AddIcon />}  // Use AddIcon for the plus button
                                        variant="solid"  // Use solid variant for better visibility
                                        colorScheme="orange" // Change color scheme for contrast
                                        size="lg" // Increase size for better visibility
                                        _hover={{ bg: "orange.600", color: "white" }} // Change background and text color on hover
                                        bg="black"
                                        onClick={(e) => handleDrillDown(e, cluster.CLUSTER_NAMES)} 
                                    />
                                    {/* Second IconButton for additional info */}
                                    <IconButton 
                                        aria-label={`Show info for ${cluster.CLUSTER_NAMES}`} 
                                        icon={<InfoIcon />} 
                                        variant="solid"  // Use outline variant for contrast
                                        colorScheme="orange" // Change color scheme for contrast
                                        size="lg" // Increase size for better visibility
                                        
                                        _hover={{ bg: "orange.600", color: "white" }}
                                        bg="black"
                                        onClick={() => handleInfoClick(cluster.CLUSTER_NAMES,
                                            selectedRunName
                                        )} 
                                    />
                                </CardHeader>
                                <CardBody p={4}>
                                    <Text fontSize="2xl" fontWeight="bold">{cluster.count}</Text> {/* Render the count property */}
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>
            )}
        </VStack>
    );
};

export default ClusterCounts;