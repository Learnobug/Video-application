import React, { useEffect } from 'react'
import { useState ,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading ,Box} from '@chakra-ui/react'
import { useSocket } from '../Context/SocketProvider';
import { FormControl, FormLabel,Input,VStack,Button } from "@chakra-ui/react";
const Lobby = () => {
  const navigate=useNavigate();
  const [email,setemail]=useState("");
  const [room,setroom]=useState("");
  const socket=useSocket();


  const handlesubmitForm =useCallback(
    (e)=>{
      e.preventDefault();
      socket.emit("room:join",{email,room});
    },[email,room,socket]
  )


  const handleJoinRoom =useCallback((data)=>{
    const {email,room}=data;
     navigate(`/room/${room}`);
  },[navigate])


  useEffect(()=>{
   socket.on("room:join",handleJoinRoom)
   return ()=>{
    socket.off('room:join',handleJoinRoom)
   }
  },[socket])

    return (
     
      <VStack spacing="10px" w="50%" mx="auto" mt="6%" mb="10%" p="3%" alignContent justifyItems backgroundColor='white' borderRadius="10">
      
        <Heading margin="10px">Lobby</Heading>
        
          <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          value={email}
          placeholder="Enter Your Email Address"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>
          
      <FormControl id="room" isRequired>
        <FormLabel>ROOM:</FormLabel>
        <Input
          type="room"
          value={room}
          placeholder="Enter Room  No."
          onChange={(e) => setroom(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handlesubmitForm}
          >
        Join
      </Button>
      </VStack>
    
    )
}

export default Lobby
