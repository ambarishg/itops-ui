import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    useToast,
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
    Modal, ModalOverlay, ModalContent, 
    ModalHeader, ModalCloseButton, ModalBody, 
    ModalFooter, FormControl,Input,FormLabel
} from '@chakra-ui/react';
import { AddIcon, InfoIcon ,PlusSquareIcon} from '@chakra-ui/icons'; // Importing Add and Info icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

const ClusterCounts = () => {
    const toast = useToast();
    const [runNames, setRunNames] = useState([]); // State for storing run names
    const [selectedRunName, setSelectedRunName] = useState(''); // State for selected run name
    const [selectedRunNameLabel, setSelectedRunNameLabel] = useState(''); // State for selected run name
    const [clusterCounts, setClusterCounts] = useState([]); // Initialize as an empty array
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // Initialize the navigate hook
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loadingRuns, setLoadingRuns] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // State for modal visibility
    const [subclusterCount, setSubclusterCount] = useState(''); // State for subcluster input
    const [subclusterRunName, setSubclusterRunName] = useState('');
    const [currentClusterName, setCurrentClusterName] = useState('');
    const [currentClusterNameLabel, setCurrentClusterNameLabel] = useState('');


        const handleOnChange = (event) => {
            const selectedOptionValue = event.target.value;
            const selectedOptionLabel = event.target.options[event.target.selectedIndex].getAttribute('label');
            
            setSelectedRunName(selectedOptionValue);
            setSelectedRunNameLabel(selectedOptionLabel);
        };

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
                    setRunNames(response.data.map(run => ({ value: run[0], label: run[1] })));
                }
                else{
                    setRunNames([])
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
                category_name:selectedCategory
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
        console.log("Cluster ID is ");
        console.log(clusterName);
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

    const handleInfoClick = (clusterName, runName,categoryName) => {
        console.log(`Showing info for ${clusterName} in run ${runName}`);
        // Navigate to the Cluster Info page with both cluster and run names
        navigate(`/cluster-info/${clusterName}?run=${runName}&category=${categoryName}`);
    };

    const openSubclusterModal = (clusterName,clusterNameLabel) => {
        setCurrentClusterName(clusterName);
        setCurrentClusterNameLabel(clusterNameLabel);
        setIsOpen(true);
    };

     // Function to handle subcluster submission
     const handleSubclusterSubmit = async () => {
        setLoading(true);
        console.log(`Number of subclusters for ${selectedRunName}: ${subclusterCount}`);
        // Add logic here to handle the subcluster count as needed
        
        const response = await axios.post('http://127.0.0.1:8000/rerun-sub-cluster/', {
            run_name: subclusterRunName,
            parent_run_name: selectedRunName,
            parent_cluster_name: currentClusterName,
            category_name: selectedCategory,
            num_clusters: subclusterCount
        });


        toast({
            title: 'Sub Cluster Run',
            description: response.data.message,
            duration: 5000,
            isClosable: true,
          });
        setLoading(false);
        setSelectedRunName(response.data.RUN_ID);
        setIsOpen(false); // Close the modal after submission
        setSubclusterCount(''); // Reset input field
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
                    onChange={(e) => handleOnChange(e)}
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
                        <option key={run.value} 
                        value={run.value}
                        label={run.label}>{run.label}</option>
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
                    <Text fontSize="xl" mb={2}>Results for Run: <strong>{selectedRunNameLabel}</strong></Text>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {clusterCounts.map((cluster) => (
                        <Card 
                        key={cluster.CLUSTER_ID} 
                        borderWidth="1px" 
                        borderRadius="lg" 
                        overflow="hidden" 
                        _hover={{ transform: 'scale(1.1)', boxShadow: 'lg', zIndex: 1 }} // Scale on hover
                        transition="transform 0.2s ease, box-shadow 0.2s ease" // Smooth transition
                        >
                        <CardHeader bg="teal.100" color="black" p={4} display="flex" justifyContent="space-between">
                            <Text>{cluster.CLUSTER_NAMES}</Text>
                            <IconButton aria-label={`Add or drill down into ${cluster.CLUSTER_NAMES}`} icon={<AddIcon />} variant="solid" size="lg" _hover={{ bg: "orange.600", color: "white" }} bg="black" onClick={(e) => handleDrillDown(e, cluster.CLUSTER_ID)} />
                            <IconButton aria-label={`Show info for ${cluster.CLUSTER_NAMES}`} icon={<InfoIcon />} variant="solid" size="lg" _hover={{ bg: "orange.600", color: "white" }} bg="black" onClick={() => handleInfoClick(cluster.CLUSTER_ID, selectedRunName, selectedCategory)} />
                        </CardHeader>
                        <CardBody p={4} display="flex" justifyContent="space-between">
                            <Text fontSize="2xl" fontWeight="bold">{cluster.CLUSTERS}</Text>
                            <IconButton aria-label={`Set subclusters for ${cluster.CLUSTER_NAMES}`} icon={<PlusSquareIcon />} variant="solid" colorScheme="blue" _hover={{ bg: "blue.600", color: "white" }} bg="black" onClick={() => openSubclusterModal(cluster.CLUSTER_ID,cluster.CLUSTER_NAMES)} />
                        </CardBody>
                        </Card>
                    ))}
                    </SimpleGrid>
                </Box>
            )}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md" isCentered>
            <ModalOverlay />
            <ModalContent bg="gray.800" borderRadius="lg" boxShadow="lg">
                <ModalHeader color="white" fontWeight="bold">Subcluster Input</ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody>
                <VStack spacing={4} align="stretch">
                    <Text fontWeight="bold" fontSize="lg" color="white">
                    Category: {selectedCategory}
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color="white">
                    Run: {selectedRunNameLabel}
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color="white">
                    Cluster: {currentClusterNameLabel}
                    </Text>
                    <FormControl isRequired>
                    <FormLabel color="gray.300">Sub Cluster Run Name</FormLabel>
                    <Input
                        value={subclusterRunName}
                        onChange={(e) => setSubclusterRunName(e.target.value)}
                        placeholder="Enter the subcluster Run Name"
                        variant="filled"
                        size="lg"
                        focusBorderColor="blue.500"
                        bgColor="gray.700"
                        color="white"
                    />
                    </FormControl>
                    <FormControl isRequired>
                    <FormLabel color="gray.300">Number of Subclusters</FormLabel>
                    <Input
                        type="number"
                        value={subclusterCount}
                        onChange={(e) => setSubclusterCount(e.target.value)}
                        placeholder="Enter number of subclusters"
                        variant="filled"
                        size="lg"
                        focusBorderColor="blue.500"
                        bgColor="gray.700"
                        color="white"
                    />
                    </FormControl>
                    
                </VStack>
                </ModalBody>
                <ModalFooter>
                <Button
                    colorScheme="blue"
                    onClick={handleSubclusterSubmit}
                    isDisabled={!subclusterCount}
                    isLoading={loading}
                >
                    Submit
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)} colorScheme="gray">
                    Cancel
                </Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </VStack>
    );
};

export default ClusterCounts;