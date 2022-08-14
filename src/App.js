import { Heading, IconButton, VStack, useColorMode, Button, Text, Image, useToast, HStack, Skeleton, Stack } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa'
import './App.css';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import moment from 'moment';

import { useAuth0 } from '@auth0/auth0-react'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [curr, setCurr] = useState(() => JSON.parse(localStorage.getItem('todos')) || [])

  const callAPI = useRef(false);
  callAPI.current = curr.length === 0;
  useEffect(() => {
    async function fetchData() {
      if (user) {
        await axios.get('https://asia-south1.gcp.data.mongodb-api.com/app/application-0-idmbw/endpoint/getKaamKarlo', { params: { user_id: user.sub }})
        .then(res => {
          localStorage.setItem('todos', res.data);
          setCurr(JSON.parse(res.data));
        }).catch(err => {
          console.log(err);
        });
      }
    }
    console.log(callAPI.current);
    if (callAPI.current) {
      callAPI.current = false;
      fetchData();
    }
  }, [user]);

  
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
  
  const toast = useToast();
  
  async function saveList() {
    await axios.post('https://asia-south1.gcp.data.mongodb-api.com/app/application-0-idmbw/endpoint/createKaamKarlo', curr, { params: { user_id: user.sub } })
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
      <VStack p={4} w="100vw">
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
                <Button onClick={() => loginWithRedirect()}>Login</Button>
                <Text fontSize='4xl'> You must be logged in to use this app </Text>
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
      </VStack>
    </div>
  );
}

export default App;