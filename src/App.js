import { Heading, IconButton, VStack, useColorMode, Button, Text, Image } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa'
import './App.css';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import moment from 'moment';

import { useAuth0 } from '@auth0/auth0-react'

import { useEffect, useState } from 'react'

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0(); 

  const [curr, setCurr] = useState(() => JSON.parse(localStorage.getItem('todos')) || [])
  
  useEffect(()=>{
    localStorage.setItem('todos', JSON.stringify(curr))
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

  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <div className="App">
      <VStack p={4} w="100vw">
        <IconButton 
          icon={
            colorMode === 'light'  ? 
            <FaMoon /> :
            <FaSun />
          } 
          isRound={true}
          size="lg" 
          alignSelf="flex-end"
          onClick={toggleColorMode}
        />
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
              <Image src={user.picture} alt="Profile" borderRadius='full' boxSize='80px'/>
              <Button onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>
              <TodoList todos={curr} deleteTodo={deleteTodo}/>
              <AddTodo addTodo={addTodo}/>
            </> :
            <>
              <Button onClick={() => loginWithRedirect()}>Login</Button>
              <Text fontSize='4xl'> You must be logged in to use this app </Text>              
            </>
        }
      </VStack>
    </div>
  );
}

export default App;