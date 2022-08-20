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
  Link,
  Box
} from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa'
import { AiFillGithub, AiFillHeart, AiFillLinkedin, AiFillTwitterSquare } from 'react-icons/ai'
import './App.css';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import axios from 'axios';
import moment from 'moment';

import { useAuth0 } from '@auth0/auth0-react'

import { useEffect, useRef, useState } from 'react'
import { BiGlobe } from 'react-icons/bi';

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
  
  // Call API function only once if condition satisfies
  const callAPI = useRef(false);
  callAPI.current = curr.length === 0;
  
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
              setCurr(res.data);
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

  function addTodo(text){
    let newCurr = [
      ...curr, 
      {
        id: curr.length + 1, 
        body: text, 
        time: moment(new Date()).format('lll')
      }
    ]
    setCurr(newCurr);
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

  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <div className="App">
      <VStack p={4} w="100%">
        <HStack w='100%' alignSelf='flex-start' justifyContent='space-between'>
          <IconButton 
            icon={
              colorMode === 'light'  ? 
              <FaMoon /> :
              <FaSun />
            } 
            isRound={true}
            size="lg" 
            alignSelf="flex-start"
            onClick={toggleColorMode}
          />
          {
            isAuthenticated && 
            <HStack spacing={25}>
              <Text fontSize='2xl' border="1px" p='5px 10px' borderRadius='10px'>{ user.name }</Text>
              <Image src={user.picture} alt="Profile" borderRadius='full' boxSize='50px'/>
              <Button onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>
            </HStack>
          }
        </HStack>
        
        <Heading
          p={10}
          fontWeight="extrabold"
          size="4xl"
          bgGradient="linear(to-r, pink.500, pink.300, blue.500)"
          bgClip="text"
        >
          Kaam Karlo | काम करलो
        </Heading>
        {
          isAuthenticated ? 
            <>
              <TodoList todos={curr} deleteTodo={deleteTodo}/>
              <AddTodo addTodo={addTodo} saveList={saveList}/>
            </> :
              !isLoading ?
              <>
                <Button onClick={() => loginWithPopup()}>Login</Button>
                <Text fontSize='4xl'> You must be logged in to use this app </Text>
                {/* <Text>Make sure to verify your email address!</Text> */}
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
        <HStack>
          <Text top='100%'>made with ❤️ by @ayushbasak</Text>
          <Link href="https://github.com/ayushbasak"><AiFillGithub/></Link>
          <Link href="https://linkedin.com/in/ayushbasak"><AiFillLinkedin/></Link>
          <Link href="https://basak.app"><BiGlobe/></Link>
        </HStack>
        <Text>&copy; 2022 KaamKarlo</Text>
      </VStack>
    </div>
  );
}

export default App;