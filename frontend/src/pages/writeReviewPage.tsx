
import { Button } from '../components/ui/button'
import { useColorModeValue } from '../components/ui/color-mode'
import { Box, Container, Heading, Input, VStack} from '@chakra-ui/react'
import { useState } from 'react'
import { useLocation } from "react-router-dom";
import { useReviewStore } from "../store/review.js"
import { useNavigate } from 'react-router-dom'
import { toaster} from '../components/ui/toaster.js'

const WriteReviewPage= ()=> {
    const location= useLocation();
    const {product}= location.state;
    const {createreview, reviews}=useReviewStore();
    const navigate= useNavigate();

    const [newReview, setNewReview]= useState({
        rating: "",
        comment: "",
        SellerID: "",
    })

    const handleaddreview= async()=> {
        const args={...newReview, SellerID: product.SellerID};
        const {success, message}= await createreview(args);
        if(success){
            toaster.create({
                title: "Success",
                description: message,
                type: "success"
            })
            navigate("/orders/history");
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
                        Give Review
                    </Heading>
                    <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <VStack borderSpacing={4}>
                            <Input placeholder='Rating out of 5' name='Rating' value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Input placeholder='Comment' name='Comment' value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                            <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleaddreview}>
                                Confirm Review
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default WriteReviewPage;