import { 
    HStack, 
    VStack, 
    Text, 
    IconButton, 
    StackDivider, 
    Spacer, 
    Badge, 
    Container, 
    Link, 
    Slider, 
    SliderTrack, 
    SliderFilledTrack, 
    SliderThumb, 
    Checkbox, 
    Input, 
    useColorModeValue, 
    CircularProgress,
    CircularProgressLabel 
} from '@chakra-ui/react'
import React from 'react'
import { FaTrash, } from 'react-icons/fa';
import { BiLinkExternal } from 'react-icons/bi';
import moment from 'moment';
export default function TodoList({todos, deleteTodo, updateTodo}) {

    const bg = useColorModeValue("red.300", "red.700");
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
        var expression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        return link.match(regex);
    }

    function sliderTrackHandler(value, id){
        updateTodo(id, value);
    }

    function checkboxHandler(value, id){
        updateTodo(id, value);
        // console.log(id, value);
    }
    
    function passedDueDate(date) {
        date = moment(date);
        return moment(date).isBefore(moment() + 1, 'day');  
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
                todos.map((todo, key) => 
                    <HStack 
                        key={todo.id} 
                        bg={passedDueDate(todo.dueDate) ? bg : 'transparent'} 
                        p={1} 
                        rounded='xl'
                    >
                        { 
                            isURL(todo.body) ?
                                <Link href={todo.body} isExternal>
                                    <HStack>
                                        <Container maxW='xl'>
                                            <Text maxW = {{ base: '40vw', sm: '40vw', lg: '70vw', xl: '70vw' }} isTruncated>{todo.body}</Text> 
                                        </Container>
                                        <BiLinkExternal /> 
                                    </HStack>
                                </Link> :
                                <Container maxW={{ base: '100%', sm: '40vw', lg: '70vw', xl: '70vw' }}>
                                    <HStack justifyContent='space-between' flexDir={{ base: 'column', sm: 'row' }}>
                                        <HStack m={5}>
                                            <Checkbox onChange={(e) => checkboxHandler(e.target.checked, todo.id)} isChecked={todo.completed}/>
                                            <Text maxW = {{ base: '50vw', sm: '50vw', lg: '70vw', xl: '70vw' }} isTruncated >{todo.body}</Text>
                                        </HStack>
                                        <Spacer />
                                        <HStack  w = {{ base: '100%', sm: '100%', lg: '20%'}} >
                                            <Slider 
                                                aria-label='slider-ex-1' 
                                                defaultValue={todo.status}  
                                                w = {{ base: '100%', sm: '100%', lg: '100%'}} 
                                                onChange={(value) => sliderTrackHandler(value, todo.id)} 
                                                isDisabled={todo.completed === true}
                                            >
                                                <SliderTrack>
                                                <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb />
                                            </Slider>
                                            <CircularProgress value={todo.status} color='green.400'>
                                                <CircularProgressLabel>{todo.status}%</CircularProgressLabel>
                                            </CircularProgress>
                                        </HStack>
                                        <Container maxW={{ base: '100%', sm: '100%', lg: '30%'}}>
                                            <Text>Due Date</Text>
                                            <Input type='date' defaultValue={moment(todo.dueDate).format('YYYY-MM-DD')} disabled />
                                        </Container>
                                    </HStack>
                                </Container>
                        }
                        <Spacer />
                        {/* <IconButton icon={<FaPen />} isRound='true' /> */}
                        <IconButton icon = {<FaTrash />} isRound="true" onClick={()=>{deleteTodo(todo.id)}}/>
                    </HStack>
                )
            }
        </VStack>
    )
}
