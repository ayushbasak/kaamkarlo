import { HStack, VStack, Text, IconButton, StackDivider, Spacer, Badge, Container, Link } from '@chakra-ui/react'
import React from 'react'
import { FaTrash, } from 'react-icons/fa';
import { BiLinkExternal } from 'react-icons/bi';

export default function TodoList({todos, deleteTodo}) {

    if(!todos.length){
        return (
            <Badge
                p={4}
                w="40vw"
                colorScheme="green"
                variant="outline"
                borderRadius={4}
            >
                No pending Tasks
            </Badge>
        );
    }

    function isURL(link) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        return link.match(regex);
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
        maxW = {{ base: '90vw', sm: '80vw', lg: '80vw', xl: '80vw' }}
        alignItems="stretch"
        >
            {
                todos.map(todo => 
                    <HStack key={todo.id}>
                        { 
                            isURL(todo.body) ?
                                <Link href={todo.body} isExternal>
                                    <HStack>
                                        <Container maxW='xl'><Text maxW = {{ base: '40vw', sm: '40vw', lg: '70vw', xl: '70vw' }} isTruncated>{todo.body}</Text> </Container>
                                        <BiLinkExternal /> 
                                    </HStack>
                                </Link> :
                                <Container maxW='xl'>
                                    <Text maxW = {{ base: '50vw', sm: '50vw', lg: '70vw', xl: '70vw' }} isTruncated >{todo.body}</Text>
                                </Container>
                        }
                        <Spacer />
                        <Text>{todo.time}</Text>
                        <IconButton icon = {<FaTrash />} isRound="true" onClick={()=>{deleteTodo(todo.id)}}/>
                    </HStack>
                )
            }
        </VStack>
    )
}
