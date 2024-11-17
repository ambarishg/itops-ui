import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Select, 
  Box, 
  Heading, 
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

  const [runNames, setRunNames] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [clusterNames, setClusterNames] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(clusterName);
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
  }, [location.search]);

  // Fetch RUN names
  useEffect(() => {
    const fetchRunNames = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/get-run-names/');
        setRunNames(response.data.map(run => ({ value: run, label: run })));
      } catch (error) {
        console.error('Error fetching run names:', error);
        setErrorMessage('Failed to fetch run names.');
      } finally {
        setLoadingRuns(false);
      }
    };

    fetchRunNames();
  }, []);

  // Fetch Cluster names based on selected RUN name
  useEffect(() => {
    if (selectedRun) {
      const fetchClusterNames = async () => {
        try {
          setLoadingClusters(true);
          const response = await axios.post('http://127.0.0.1:8000/cluster-counts/', {
            run_name: selectedRun.value,
          });
          setClusterNames(response.data.map(cluster => ({ value: cluster.CLUSTER_NAMES, label: cluster.CLUSTER_NAMES })));
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
          // Reset solutions before fetching new ones
          setSolutions([]); 
          setChallenges([]); // Reset challenges
          setErrorMessage(null);
          
          const responseSolutions = await axios.post('http://127.0.0.1:8000/get-insights-solutions', {
            run_name: selectedRun.value,
            cluster_name: selectedCluster,
            description_column_name: 'Solution',
          });
          
          // Split solutions by newline and store in state
          setSolutions(responseSolutions.data.solutions.split('\n')); 

          // Fetch challenges similarly
          const responseChallenges = await axios.post('http://127.0.0.1:8000/get-insights-challenges', { // New API for challenges
            run_name: selectedRun.value,
            cluster_name: selectedCluster,
            description_column_name: 'Text', // Adjust this as needed
          });

          // Split challenges by newline and store in state
          setChallenges(responseChallenges.data.challenges.split('\n'));
          
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
      <Text fontSize="2xl">Cluster Info: {clusterName}</Text>

      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
      
      <Select 
        placeholder="Select a Run" 
        value={selectedRun ? selectedRun.value : ''}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selectedOption = runNames.find(run => run.value === selectedValue);
          setSelectedRun(selectedOption);
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
          <option key={run.value} value={run.value}>{run.label}</option>
        ))}
      </Select>

      {selectedRun && (
        <Select 
          placeholder="Select a Cluster" 
          value={selectedCluster || ''}
          onChange={(e) => {
            setSelectedCluster(e.target.value); 
            setSolutions([]); // Clear solutions when changing clusters
            setChallenges([]); // Clear challenges when changing clusters
          }} 
          mb={4}
          bg="white"
          color="black"
          isDisabled={loadingClusters}
        >
          {clusterNames.map(cluster => (
            <option key={cluster.value} value={cluster.value}>{cluster.label}</option>
          ))}
        </Select>
      )}

      {/* Tabs for Solutions and Challenges */}
      <Tabs mt={4}>
        <TabList>
          <Tab>Insights Solutions</Tab>
          <Tab>Insights Challenges</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {loadingSolutions ? (
              <Spinner size="lg" />
            ) : (
              <Box mt={4}>
                {solutions.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {solutions.map((solution, index) => (
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

          <TabPanel>
            {loadingChallenges ? (
              <Spinner size="lg" />
            ) : (
              <Box mt={4}>
                {challenges.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {challenges.map((challenge, index) => (
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
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ClusterInfo;