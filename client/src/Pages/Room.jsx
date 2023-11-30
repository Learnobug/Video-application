import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import { useSocket } from "../Context/SocketProvider";
import { Heading ,Box,Button,VStack} from '@chakra-ui/react'
const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <VStack h="100%" w="100%"  alignItems="center" justifyContent="center" >
      <Heading textAlign={"center"} alignContent justifyItems >Room Page</Heading>
      <Heading mt="1%" textAlign={"center"} alignContent justifyItems >{remoteSocketId ? "Connected" : "No one in room"}</Heading>
      <Box h="5%" w="100%" display="flex" p="2%" alignItems="center" justifyContent="center">
      {myStream && <Button  alignItems="center" justifyContent="center" mr="2%" onClick={sendStreams}>Send Stream</Button>}
      {remoteSocketId && <Button alignItems="center" justifyContent="center" ml="2%" onClick={handleCallUser}>CALL</Button>}
      </Box>
      <Box display="flex" h="100%" w="100%" mb="3%" alignItems="center" justifyContent="center" >
      {myStream && (
        <Box alignItems="center" justifyContent="center" p="3%" ml="1%"w="45%" mb="2%">
          <Heading m="3%" p="1%"  textAlign={"center"}>My Stream</Heading>
          <ReactPlayer
            playing
            muted
            height="350px"
            width="500px"
            url={myStream}
          />
        </Box>
      )}
      {remoteStream && (
        <Box
        alignItems="center" justifyContent="center" p="3%" ml="1%"w="45%"  mb="2%"
        >
          <Heading m="3%" p="1%"  textAlign={"center"}>Remote Stream</Heading>
          <ReactPlayer
            playing
            muted
            height="350px"
            width="500px"
            url={remoteStream}
          />
        </Box>
      )}
      </Box>
    </VStack>
  );
};

export default RoomPage;