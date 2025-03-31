import { useNavigate, useLocation } from "react-router-dom";
import { Button } from '../components/ui/button'
import { useColorModeValue } from '../components/ui/color-mode'
import { Box, Container, Heading, Input, VStack, HStack, Text} from '@chakra-ui/react'
import {useItemStore} from '../store/item.js'
import { toaster} from '../components/ui/toaster.js'

const DeleteItemPage= ()=> {
    const location= useLocation();
    const {item}= location.state || {};
    const navigate= useNavigate();
    const {deleteItem}= useItemStore();
    const handleYes= async()=> {
        const {success, message}= await deleteItem(item._id);
        if(success){
            toaster.create({
                title: "Success",
                description: message,
                type: "success"
            })
            navigate("/myitems")
        } else{
            toaster.create({
                title: "Error",
                description: message,
                type: "error",
            })
        }
    }
    const handleNo= async()=> {
        navigate("/myitems");
    }

    return(
        <div>
            <Container maxW={"container.sm"} m={5} alignItems={"center"}>
                <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"} >
                    <VStack>
                        <Text>
                            Are you sure you want to delete the Item?
                        </Text>
                        <HStack justifyContent={"center"}>
                        <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleYes}>
                            Yes
                        </Button>
                        <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleNo}>
                            No
                        </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Container>
        </div>
    )
}

export default DeleteItemPage;
