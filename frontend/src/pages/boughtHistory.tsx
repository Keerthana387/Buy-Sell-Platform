import { useEffect, useState } from "react";
import {useOrderStore} from '../store/order.js'
import { useNavigate } from 'react-router-dom'
import { Container, Heading,VStack,Box,SimpleGrid,Text } from "@chakra-ui/react";
import OrderCard from "../components/ui/ordercard.js";
import { useColorModeValue } from "../components/ui/color-mode";
import {useItemStore} from '../store/item.js'
import { toaster} from '../components/ui/toaster.js'
import { Button } from "../components/ui/button.js";

const BoughtHistory= ()=> {
    const {getboughtOrders, boughtorders}= useOrderStore();
    const navigate= useNavigate();
    const {fetchItems, items}= useItemStore();
    useEffect(()=> {
        const fetchData= async()=> {
            const token =localStorage.getItem("token");
            if(!token){
            navigate("/");
            };
            await getboughtOrders();
        }
        fetchData();
    }, [getboughtOrders,navigate])

    const handleitempage=async(product)=> {
        console.log(product);
        const args={itemId: product.ItemID};
        const {success, message, data}=await fetchItems(args);
        if(!success){
            toaster.create({
                title: "Error",
                description: message,
                type: "error",
            })
        } else{
            const product=data[0];
            if(product){
                navigate(`/search/${product.ItemID}`,{state: {product}});
            }
        }
    }

    const handlereview=async(product)=> {
        navigate("/writereview",{state: {product}});
    }

    return(
        <div>
            <Container maxW={"container.sm"}>
                <VStack borderSpacing={8}>
                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                        Orders Bought
                    </Heading>
                    <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3,}} w={"full"} >
                            {boughtorders.map((product) => (
                                <Container>
                                    <Box onClick={()=>{handleitempage(product)}}>
					                    <OrderCard item={product} />
                                    </Box>
                                    <Button bg={useColorModeValue("white","gray.800")} p={6} rounded={"lg"} shadow={"md"} onClick={()=>{handlereview(product)}} w={"full"}>
                                        <Text fontSize='l' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")}>
                                            Give review
                                        </Text>
                                    </Button>
                                </Container>
				            ))}
                        </SimpleGrid>
                        {boughtorders.length===0 && (
                            <Text fontSize='xl' textAlign={"center"} fontWeight='bold'>
                            No Orders Bought {" "}
                            </Text>
                        )}
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default BoughtHistory;