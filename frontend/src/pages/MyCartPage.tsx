import { useColorModeValue } from "../components/ui/color-mode";
import { Container, Heading, VStack, Box, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/user.js'
import { Button } from "../components/ui/button.js";
import ProductCard from "../components/ui/itemcard.js";
import { toaster} from '../components/ui/toaster.js';

const MyCartPage= ()=> {

    const navigate= useNavigate();
    const { GetCart , items, RemoveFromCart, placeOrder }= useUserStore();
    const [totalPrice, settotalPrice]= useState(0);

    useEffect(()=> {
        const fetchData= async()=> {
            const token =localStorage.getItem("token");
            if(!token){
            navigate("/");
            };
            await GetCart();
            const total= items.reduce((sum,item)=> sum+item.Price, 0);
            settotalPrice(total);
        }
        fetchData();
    }, [GetCart,navigate,items])

    const handleItemPage= async(product)=> {
        navigate(`/search/${product._id}`,{state: {product}});
    }

    const handleremovefromcart= async(product)=> {
        const {success, message}= await RemoveFromCart(product._id);
        if(success){
            toaster.create({
            title: "Success",
            description: message,
            type: "success"
            })
        } else{
            toaster.create({
            title: "Error",
            description: message,
            type: "error",
            })
        }
    }

    const handleplaceorder= async()=> {
        const {success, message}= await placeOrder();
        if(success){
            toaster.create({
            title: "Success",
            description: message,
            type: "success"
            })
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
                        Cart
                    </Heading>
                    <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3,}} w={"full"} >
                            {items.map((product) => (
                                <Container>
                                    <Box onClick={()=> handleItemPage(product)}>
					                    <ProductCard item={product} />
                                    </Box>
                                    <Button bg={useColorModeValue("red","red")} p={6} rounded={"lg"} shadow={"md"} onClick={()=>handleremovefromcart(product)}>
                                        <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")}>
                                            Remove from Cart
                                        </Text>
                                    </Button>
                                </Container>
				            ))}
                        </SimpleGrid>
                        {items.length===0 && (
                            <Text fontSize='xl' textAlign={"center"} fontWeight='bold'>
                                No products found {" "}
                            </Text>
                        )}
                        {items.length>0 && (
                            <VStack>
                                <Text fontSize="xl" fontWeight="bold" mt={4}>
                                    Total Price: Rs.{totalPrice}
                                </Text>
                                <Button bg={useColorModeValue("white","gray.800")} p={6} rounded={"lg"} shadow={"md"} >
                                    <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")} onClick={()=>handleplaceorder()}>
                                        Place Order
                                    </Text>
                                </Button>
                            </VStack>
                        )}
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default MyCartPage;