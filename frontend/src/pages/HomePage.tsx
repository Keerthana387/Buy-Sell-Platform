import { Box, HStack, Container, VStack, Heading } from '@chakra-ui/react'
import { useColorModeValue } from '../components/ui/color-mode'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useEffect} from 'react'
import React from 'react'

const HomePage = () => {
  const navigate= useNavigate();

  const handleRegister= async()=> {
    navigate("/register")
  }
  const handleLogin= async()=> {
    navigate("/login");
  }

  useEffect(()=> {
    const token =localStorage.getItem("token");
    if(token){
      navigate("/profile");
    }
  })

  return (
    <div>
      <Container>
        <VStack>
          <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
            Home
          </Heading>
          <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
            <HStack borderSpacing={4}>
              <Button m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleRegister}>
                Register
              </Button>
              <Button m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleLogin}>
                Login
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </div>
  )
}

export default HomePage