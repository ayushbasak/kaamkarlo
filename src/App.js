import { 
  Heading, 
  IconButton, 
  VStack, 
  useColorMode,
  Button, 
  Text, 
  Image, 
  useToast, 
  HStack, 
  Skeleton, 
  Stack,
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaCrown } from 'react-icons/fa'
import './App.css';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import axios from 'axios';
import moment from 'moment';

import { useAuth0 } from '@auth0/auth0-react'

import { useEffect, useRef, useState } from 'react'
import Footer from './components/Footer';


function App() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    loginWithPopup, 
    logout, 
    getAccessTokenSilently 
  } = useAuth0();
  
  const toast = useToast();

  const [curr, setCurr] = useState(() => JSON.parse(localStorage.getItem('todos')) || [])
  const [userInfo, setUserInfo] = useState({});  
  // Call API function only once if condition satisfies
  const callAPI = useRef(false);
  callAPI.current = curr.length === 0;
  
  useEffect(() => {
    if (window.localStorage.userInfo !== undefined) {
      setUserInfo(JSON.parse(window.localStorage.userInfo));
    }
  }, [])

  useEffect(() => {
    if (callAPI.current) {
      async function fetchData() {
        if (isAuthenticated) {
          const accessToken = await getAccessTokenSilently();
          await axios.get('https://asia-south1.gcp.data.mongodb-api.com/app/application-0-idmbw/endpoint/getKaamKarlo', 
            { 
              headers: {
                Authorization: `Bearer ${accessToken}` 
              }
            }
          )
            .then(res => {
              localStorage.setItem('todos', JSON.stringify(res.data));
              setCurr(res.data.data);

              const save_userInfo = {
                email: res.data.email,
                premium: res.data.premium || false,
              };

              window.localStorage.setItem('userInfo', JSON.stringify(save_userInfo));
              setUserInfo(save_userInfo)
              toast({
                title: 'Success',
                description: 'Todos fetched successfully',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-left',
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
      callAPI.current = false;
      fetchData();
    }
  }, [isAuthenticated, getAccessTokenSilently, toast]);

  // update localstorage on every change of todos
  useEffect(()=>{
    localStorage.setItem('todos', JSON.stringify(curr));
  }, [curr])

  function deleteTodo(id){
    let newCurr = curr.filter(d => d.id !== id)
    setCurr(newCurr)
  }

  function updateTodo(id, value) {
    let newCurr = curr.map(d => {
      if(d.id === id){
        if (typeof value === 'boolean')
          d.completed = value;
        else
          d.status = Number(value) || 0;
      }
      return d;
    })
    setCurr(newCurr)
  }



  function addTodo(content){
    console.log(userInfo, ' user info');
    let newCurr = [
      ...curr, 
      {
        id: (Math.random() + 1).toString(36).substring(2), 
        body: content.text,
        dueDate: content.dueDate, 
        time: moment(new Date()).format('lll'),
        status: 0,
      }
    ]
    setCurr(newCurr);
  }
  
  function premium() {
    toast({
      title: 'You are a Premium Member!',
      description: 'New Features will be announced soon',
      status: 'warning',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  }

  async function saveList() {
    if (!isAuthenticated) {
      return;
    }
    const accessToken = await getAccessTokenSilently();
    await axios.post('https://asia-south1.gcp.data.mongodb-api.com/app/application-0-idmbw/endpoint/createKaamKarlo', 
      curr, 
      { 
        headers: {
          Authorization: `Bearer ${accessToken}` 
        } 
      }
    )
      .then(res => {
        toast(
          {
              title: "Saved",
              description: "by " + user.name,
              status: "success",
              position: 'top-left',
              duration: 2000,
              isClosable: true,
          }
        );
      })
      .catch(err => {
        toast(
          {
              title: "Error",
              description: err.error,
              status: "error",
              position: 'top-left',
              duration: 2000,
              isClosable: true,
          }
        );
      })
  }

  function logout_and_clear() {
    localStorage.clear();
    logout({ returnTo: window.location.origin })
  }

  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <div className="App">
      <VStack p={4} w="100%" h='100%'>
        <HStack w='100%' alignSelf='flex-start' justifyContent='space-between'>
          <IconButton 
            icon={
              colorMode === 'light'  ? 
              <FaMoon /> :
              <FaSun />
            } 
            isRound={true}
            size='md'
            alignSelf="flex-start"
            onClick={toggleColorMode}
          />
          {
            isAuthenticated && 
            <HStack spacing={25}>
              <HStack
                border="1px" 
                p='5px 10px' 
                borderRadius='10px'
                
              >
                {
                  userInfo.premium &&
                  <IconButton 
                    icon={<FaCrown />}
                    isRound={true}
                    size='md'
                    alignSelf="flex-start"
                    onClick={()=>premium()}
                  />
                }
                <Text
                  fontSize={{ base: '10px', md: '20px', lg: '25px' }}
                  p='5px'
                >
                  { user.name }
                </Text>
              </HStack>
              <Image src={user.picture} alt="DP" borderRadius='full' boxSize='50px' border='1px solid black'/>
              <Button onClick={() => logout_and_clear() }>Logout</Button>
            </HStack>
          }
        </HStack>
        
        <Heading
          p={10}
          fontWeight="extrabold"
          fontSize={{ base: '24px', md: '40px', lg: '56px' }}
          bgGradient="linear(to-r, pink.500, pink.300, blue.500)"
          bgClip="text"
        >
          Kaam Karlo | काम करलो
        </Heading>
        {
          isAuthenticated ? 
            <>
              <TodoList todos={curr} deleteTodo={deleteTodo} updateTodo={updateTodo}/>
              <AddTodo addTodo={addTodo} saveList={saveList}/>
            </> :
              !isLoading ?
              <>
                <Button onClick={() => loginWithPopup()}>Login</Button>
                <Text fontSize='4xl'> You must be logged in to use this app </Text>
                <Text>Make sure to verify your email address!</Text>
              </> : 
              <Stack w='xl'>
                <Text fontSize='5xl' color='gray.400'>Loading...</Text>
                <Skeleton height='20px'></Skeleton>
                <Skeleton height='20px'></Skeleton>
                <Skeleton height='20px'></Skeleton>
                <Skeleton height='20px'></Skeleton>
                <Skeleton height='20px'></Skeleton>
              </Stack>
            
        }
        <Footer />
      </VStack>
    </div>
  );
}

export default App;