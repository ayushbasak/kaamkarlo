import { Button, HStack, Input, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'

export default function AddTodo({addTodo}) {

    const toast = useToast()

    const [input, setInput] = useState('')
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
            addTodo(input)
            setInput('')
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <HStack empty={8}>
                <Input 
                    variant="filled"
                    placeholder="Add Milk to the basket"
                    value={input}
                    w="xl"
                    onChange={ (e) => {setInput(e.target.value)}}
                />
                <Button
                    colorScheme="pink"
                    px={8}
                    type="submit"
                >
                    Add
                </Button>
            </HStack>
        </form>
    )
}
