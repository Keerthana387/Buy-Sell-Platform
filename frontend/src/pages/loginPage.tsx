import { Box, Container, Heading, Input, VStack} from '@chakra-ui/react'
import { useColorModeValue } from '../components/ui/color-mode'
import { Button } from '../components/ui/button'
import { PasswordInput} from '../components/ui/password-input'
import { useState } from 'react'
import { useUserStore } from '../store/user.js'
import { toaster} from '../components/ui/toaster.js'
import { useNavigate } from 'react-router-dom'

const LoginPage= ()=> {
    const [Password,setPassword]= useState('');
    const [Email,setEmail]= useState('');
    const [Args, setArgs]= useState({
        Email: '',
        Password: '',
    })

    const {logincheck}=useUserStore();
    const navigate= useNavigate();

    const handleLoginUser= async()=> {
        const argsss= { ...Args, Email: Email, Password: Password};
        const {success, message}= await logincheck(argsss);
        if(success){
            toaster.create({
                title: "Success",
                description: message,
                type: "success"
            })
            navigate("/profile");
        } else{
            toaster.create({
                title: "Error",
                description: message,
                type: "error",
            })
        }
    }

    return(
        <div>
            <Container maxW={"container.sm"}>
                <VStack borderSpacing={8}>
                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                        Login Page
                    </Heading>
                    <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <VStack borderSpacing={4}>
                            <Input placeholder='Email' name='Email' value={Email} onChange={(e) => setEmail(e.target.value)} bg={useColorModeValue("white","gray.800")}/>
                            <PasswordInput placeholder='Password' name='Password' value={Password} onChange={(e) => setPassword(e.target.value)} bg={useColorModeValue("white","gray.800")}/>
                                <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleLoginUser}>
                                    Login
                                </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default LoginPage;