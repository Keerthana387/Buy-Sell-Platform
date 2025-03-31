import { useEffect, useState } from "react";
import {useOrderStore} from '../store/order.js'
import { useNavigate } from 'react-router-dom'
import { Container, Heading,VStack,Box,SimpleGrid,Text } from "@chakra-ui/react";
import OrderCard from "../components/ui/ordercard_2.js";
import { useColorModeValue } from "../components/ui/color-mode";
import { Button } from "../components/ui/button.js";
import { toaster} from '../components/ui/toaster.js';

const SoldHistory= ()=> {
    const {getsoldOrders, soldorders}= useOrderStore();
    const navigate= useNavigate();
    useEffect(()=> {
        const fetchData= async()=> {
            const token =localStorage.getItem("token");
            if(!token){
            navigate("/");
            };
            await getsoldOrders();
        }
        fetchData();
    }, [getsoldOrders,navigate])
    
    return(
        <div>
            <Container maxW={"container.sm"}>
                <VStack borderSpacing={8}>
                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                        Orders Sold
                    </Heading>
                    <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3,}} w={"full"} >
                            {soldorders.map((product) => (
                                <Container>
                                    <Box >
					                    <OrderCard item={product} />
                                    </Box>
                                </Container>
				            ))}
                        </SimpleGrid>
                        {soldorders.length===0 && (
                            <Text fontSize='xl' textAlign={"center"} fontWeight='bold'>
                            No Orders Sold {" "}
                            </Text>
                        )}
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default SoldHistory;