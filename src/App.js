import { Heading, IconButton, VStack, useColorMode } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa'
import './App.css';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

import { useEffect, useState } from 'react'

function App() {

  const [curr, setCurr] = useState(() => JSON.parse(localStorage.getItem('todos')) || [])
  
  useEffect(()=>{
    localStorage.setItem('todos', JSON.stringify(curr))
  }, [curr])

  function deleteTodo(id){
    let newCurr = curr.filter(d => d.id !== id)
    setCurr(newCurr)
  }

  function addTodo(text){
    let newCurr = [...curr, {id: curr.length + 1, body: text}]
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
        <TodoList todos={curr} deleteTodo={deleteTodo}/>
        <AddTodo addTodo={addTodo}/>
      </VStack>
    </div>
  );
}

export default App;