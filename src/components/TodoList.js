import { HStack, VStack, Text, IconButton, StackDivider, Spacer, Badge} from '@chakra-ui/react'
import React from 'react'
import { FaTrash } from 'react-icons/fa';

export default function TodoList({todos, deleteTodo}) {

    if(!todos.length){
        return (
            <Badge
                p={4}
                w="lg"
                colorScheme="green"
                variant="outline"
                borderRadius={4}
            >
                No pending Tasks
            </Badge>
        );
    }

    return (
        <VStack
            divider={<StackDivider />}
            borderColor="gray.100"
            borderWidth="2px"
            borderRadius="lg"
            p={3}
            m={3}
            width="5xl"
            maxW = {{ base: '90vw', sm: '80vw', lg: '50vw', xl: '40vw' }}
            alignItems="stretch"
        >
            {
                todos.map(todo => 
                    <HStack key={todo.id}>
                        <Text>{todo.body}</Text>
                        <Spacer />
                        <IconButton icon = {<FaTrash />} isRound="true" onClick={()=>{deleteTodo(todo.id)}}/>
                    </HStack>
                )
            }
        </VStack>
    )
}
