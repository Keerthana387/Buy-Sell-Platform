import { Button } from '../components/ui/button'
import { useColorModeValue } from '../components/ui/color-mode'
import { Box, Container, Heading, Input, VStack} from '@chakra-ui/react'
import { useState } from 'react'
import bcrypt from 'bcryptjs'
import { useUserStore } from '../store/user.js'
import { useNavigate } from 'react-router-dom'
import { toaster} from '../components/ui/toaster.js'
import { PasswordInput} from '../components/ui/password-input'

const UpdateProfilePage = () => {
    const [newUser, setNewUser]= useState({
        First_Name: "",
        Last_Name: "",
        Age: "",
        Contact_Number: "",
        OldPassword: "",
        NewPassword: "",
    })

    const { updateprofile }= useUserStore();
    const navigate= useNavigate();

    const handleEditprofile= async()=> {
        if(newUser.NewPassword!=""){
            const hashedPassword= await bcrypt.hash(newUser.NewPassword,10);
            const user={...newUser, NewPassword: hashedPassword};
            const {success, message}= await updateprofile(user);
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
        } else{
            const {success, message}= await updateprofile(newUser);
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
        
    }

    return (
        <div>
            <Container maxW={"container.sm"}>
                <VStack borderSpacing={8}>
                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                        Edit Profile
                    </Heading>
                    <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <VStack borderSpacing={4}>
                            <Input placeholder='First Name' name='First Name' value={newUser.First_Name} onChange={(e) => setNewUser({ ...newUser, First_Name: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Input placeholder='Last Name' name='Last Name' value={newUser.Last_Name} onChange={(e) => setNewUser({ ...newUser, Last_Name: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Input placeholder='Age' name='Age' value={newUser.Age} onChange={(e) => setNewUser({ ...newUser, Age: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Input placeholder='Contact Number' name='Contact Number' value={newUser.Contact_Number} onChange={(e) => setNewUser({ ...newUser, Contact_Number: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <PasswordInput placeholder='Old Password' name='Old Password' value={newUser.OldPassword} onChange={(e) => setNewUser({ ...newUser, OldPassword: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <PasswordInput placeholder='New Password' name='New Password' value={newUser.NewPassword} onChange={(e) => setNewUser({ ...newUser, NewPassword: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleEditprofile}>
                                Confirm Profile
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default UpdateProfilePage