import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Select, 
  Box, 
  Text, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Spinner, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel 
} from '@chakra-ui/react';
import axios from 'axios';

const ClusterInfo = () => {
  const { clusterName } = useParams();
 
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [runNames, setRunNames] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [selectedRunNameLabel, setSelectedRunNameLabel] = useState(''); // State for selected run name
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [clusterNames, setClusterNames] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(clusterName);
  const [selectedClusterLabel, setSelectedClusterLabel] = useState(''); // State for selected run name
  const [solutions, setSolutions] = useState([]);
  const [challenges, setChallenges] = useState([]); // State for challenges
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingRuns, setLoadingRuns] = useState(true);
  const [loadingClusters, setLoadingClusters] = useState(false);
  const [loadingSolutions, setLoadingSolutions] = useState(false);
  const [loadingChallenges, setLoadingChallenges] = useState(false); // Loading state for challenges

  // Extracting run name from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const runFromQuery = params.get('run');
    setSelectedRun(runFromQuery ? { value: runFromQuery, label: runFromQuery } : null);

    const categoryFromQuery = params.get('category');
    setSelectedCategory(categoryFromQuery ? { value: categoryFromQuery, label: categoryFromQuery } : null);
  }, [location.search]);

 

  // Fetch RUN names
  useEffect(() => {
    const fetchRunNames = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/get-run-names-for-category/', {
          category_name: selectedCategory.value
      });
        setRunNames(response.data.map(run => ({ value: run[0], label: run[1] })));

      } catch (error) {
        console.error('Error fetching run names:', error);
        setErrorMessage('Failed to fetch run names.');
      } finally {
        setLoadingRuns(false);
      }
    };

    fetchRunNames();
  }, [selectedCategory]);

  // Fetch Cluster names based on selected RUN name
  useEffect(() => {
    if (selectedRun) {
      const fetchClusterNames = async () => {
        try {
          setLoadingClusters(true);
          console.log(selectedRun.value,selectedCategory.value)
          const response = await axios.post('http://127.0.0.1:8000/cluster-counts/', {
            run_name: selectedRun.value,
            category_name: selectedCategory.value,
          });
          setClusterNames(response.data.map(cluster => ({ value: cluster["CLUSTER_ID"], label: cluster["CLUSTER_NAMES"] })));
          response.data.map(cluster => (console.log(cluster)))
        } catch (error) {
          console.error('Error fetching cluster names:', error);
          setErrorMessage('Failed to fetch cluster names.');
        } finally {
          setLoadingClusters(false);
        }
      };

      fetchClusterNames();
    }
  }, [selectedRun]);

  // Fetch insights solutions based on selected RUN and CLUSTER
  useEffect(() => {
    if (selectedRun && selectedCluster) {
      const fetchInsightsSolutions = async () => {
        try {
          console.log("Selected Run is ", selectedRun.value);
          console.log("Selected Cluster is ", selectedCluster);

          setLoadingSolutions(true);
          setLoadingChallenges(true);
          // Reset solutions before fetching new ones
          setSolutions([]); 
          setChallenges([]); // Reset challenges
          setErrorMessage(null);
          // Fetch challenges similarly
          const responseChallenges = await axios.post('http://127.0.0.1:8000/get-insights-challenges', { // New API for challenges
            run_name: selectedRun.value,
            category_name: selectedCategory.value,
            cluster_name: selectedCluster,
            description_column_name: 'Challenge', // Adjust this as needed
          });

          // Split challenges by newline and store in state
          setChallenges(responseChallenges.data.challenges.split('\n').filter(item => item.trim() !== ''));
                    
          const responseSolutions = await axios.post('http://127.0.0.1:8000/get-insights-solutions', {
            run_name: selectedRun.value,
            category_name: selectedCategory.value,
            cluster_name: selectedCluster,
            description_column_name: 'Solution',
          });
          
          // Split solutions by newline and store in state
          setSolutions(responseSolutions.data.solutions.split('\n')); 

        } catch (error) {
          console.error('Error fetching insights solutions or challenges:', error);
          setErrorMessage('Failed to fetch insights solutions or challenges.');
        } finally {
          setLoadingSolutions(false);
          setLoadingChallenges(false); // Ensure loading state is reset

        }
      };

      fetchInsightsSolutions();
    }
  }, [selectedRun, selectedCluster]);

  return (
    <Box p={5}>
      <br/>
  
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}

      {selectedCategory ? (
      <Text>Category Name : {selectedCategory.value}</Text>)
      :<Text></Text>}
      
      <Select 
        placeholder="Select a Run" 
        value={selectedRun ? selectedRun.value : ''}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selectedOption = runNames.find(run => run.value === selectedValue);
          setSelectedRun(selectedOption);
          const selectedOptionLabel = e.target.options[e.target.selectedIndex].getAttribute('label');
          setSelectedRunNameLabel(selectedOptionLabel);
          setSelectedCluster(null); // Reset cluster when run changes
          setSolutions([]); // Clear solutions when changing runs
          setChallenges([]); // Clear challenges when changing runs
        }} 
        mb={4}
        bg="white"
        color="black"
        isDisabled={loadingRuns}
      >
        {runNames.map(run => (
           <option key={run.value} 
           value={run.value}
           label={run.label}>{run.label}</option>
        ))}
      </Select>

      {selectedRun && (
        <Select 
          placeholder="Select a Cluster" 
          value={selectedCluster || ''}
          onChange={(e) => {
            setSelectedCluster(e.target.value); 
            const selectedOptionLabel = e.target.options[e.target.selectedIndex].getAttribute('label');
            setSelectedClusterLabel(selectedOptionLabel);
            setSolutions([]); // Clear solutions when changing clusters
            setChallenges([]); // Clear challenges when changing clusters
          }} 
          mb={4}
          bg="white"
          color="black"
          isDisabled={loadingClusters}
        >
          {clusterNames.map(cluster => (
            <option key={cluster.value} 
            value={cluster.value}
            label={cluster.label}>{cluster.label}</option>
           ))}
        </Select>
      )}

      {/* Tabs for Solutions and Challenges */}
      <Tabs mt={4}>
        <TabList>
          <Tab>Insights Challenges</Tab>
          <Tab>Insights Solutions</Tab>
        </TabList>

        <TabPanels>
          
          <TabPanel>
            {loadingChallenges ? (
              <Spinner size="lg" />
            ) : (
              <Box mt={4}>
                {challenges.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {challenges.filter(challenge => challenge.trim() !== '')
                    .map((challenge, index) => (
                      <Card key={index} borderWidth='1px' borderRadius='lg' overflow='hidden'>
                        <CardBody>
                          <Text>{challenge}</Text>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>No challenges found.</Text>
                )}
              </Box>
            )}
          </TabPanel>


          <TabPanel>
            {loadingSolutions ? (
              <Spinner size="lg" />
            ) : (
              <Box mt={4}>
                {solutions.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {solutions.filter(solution => solution.trim() !== '')
                    .map((solution, index) => (
                      <Card key={index} borderWidth='1px' borderRadius='lg' overflow='hidden'>
                        <CardBody>
                          <Text>{solution}</Text>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>No solutions found.</Text>
                )}
              </Box>
            )}
          </TabPanel>

        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ClusterInfo;