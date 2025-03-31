
import { Button } from '../components/ui/button'
import { useColorModeValue } from '../components/ui/color-mode'
import { Box, Container, Heading, Input, VStack} from '@chakra-ui/react'
import { useState } from 'react'
import { useUserStore } from '../store/user.js'
import { useNavigate } from 'react-router-dom'
import { toaster} from '../components/ui/toaster.js'
import { PasswordInput} from '../components/ui/password-input'

const RegisterPage = () => {

    const [newUser, setNewUser]= useState({
        First_Name: "",
        Last_Name: "",
        Email: "",
        Age: "",
        Contact_Number: "",
        Password: "",
    })

    const { createUser }= useUserStore();
    const navigate= useNavigate();

    const handleAddUser= async()=>{
        const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?iiit\.ac\.in$/;
        if (!emailRegex.test(newUser.Email)) {
            toaster.create({
                title: "Error",
                description: "Please use a valid IIIT email address (e.g., @students.iiit.ac.in)",
                type: "error",
            });
            return;
        }
        
        const {success,message} = await createUser(newUser);
        console.log("Success: ", success);
        console.log("Message:", message);
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

    return (
        <div>
            <Container maxW={"container.sm"}>
                <VStack borderSpacing={8}>
                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                        Register
                    </Heading>
                    <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <VStack borderSpacing={4}>
                            <Input placeholder='First Name' name='First Name' value={newUser.First_Name} onChange={(e) => setNewUser({ ...newUser, First_Name: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Input placeholder='Last Name' name='Last Name' value={newUser.Last_Name} onChange={(e) => setNewUser({ ...newUser, Last_Name: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Input placeholder='Email' name='Email' value={newUser.Email} onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Input placeholder='Age' name='Age' value={newUser.Age} onChange={(e) => setNewUser({ ...newUser, Age: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Input placeholder='Contact Number' name='Contact Number' value={newUser.Contact_Number} onChange={(e) => setNewUser({ ...newUser, Contact_Number: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <PasswordInput placeholder='Password' name='Password' value={newUser.Password} onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleAddUser}>
                                Confirm Registration
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default RegisterPage