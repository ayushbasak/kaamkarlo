import { Button, Flex, Input, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import moment from 'moment';
export default function AddTodo({addTodo, saveList}) {

    const toast = useToast()

    const [input, setInput] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    function handleSubmit(e){
        e.preventDefault();
        if(!input)
            toast(
                {
                    title: "Empty Todo",
                    description: "Sorry! But you can't add empty Todo's",
                    status: "error",
                    position: 'top-left',
                    duration: 8000,
                    isClosable: true,
                }
            );
        else{
            toast(
                {
                    title: "Added Todo",
                    description: input,
                    status: "success",
                    position: 'top-left',
                    duration: 2000,
                    isClosable: true,
                }
            );
            addTodo({ text: input, dueDate: dueDate });
            setInput('')
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Flex
                    empty={8}  
                    mb={50} 
                    maxW = {{ base: '80vw', sm: '80vw', lg: '100vw', xl: '80vw' }}
                    flexDirection={{ base: 'column', sm: 'column', lg: 'row', xl: 'row' }}
                >
                    <Input 
                        variant="filled"
                        placeholder="Add Milk to the basket"
                        value={input}
                        w="xl"
                        onChange={ (e) => {setInput(e.target.value)}}
                        m={2}
                        maxW={{ base: '80vw', sm: '80vw', lg: '100vw', xl: '80vw' }}
                    />
                    <Input 
                        type='date'
                        maxW={{ base: '80vw', sm: '100%', lg: '20%', xl: '20%' }} 
                        m={2} 
                        defaultValue={moment(dueDate).format('YYYY-MM-DD')} 
                        onChange={(e) => {setDueDate(e.target.value)}}
                    />
                    <Button
                        colorScheme="pink"
                        px={8}
                        type="submit"
                        m={2}
                    >
                        Add
                    </Button>
                    <Button
                        colorScheme="blue"
                        px={8}
                        m={2}
                        onClick={() => saveList()}
                    >
                        Save
                    </Button>
                </Flex>
            </form>
        </div>
    )
}
