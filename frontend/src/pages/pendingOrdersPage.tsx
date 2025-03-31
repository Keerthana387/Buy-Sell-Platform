import { useEffect, useState } from "react";
import {useOrderStore} from '../store/order.js'
import { useNavigate } from 'react-router-dom'
import { Container, Heading,VStack,Box,SimpleGrid,Text } from "@chakra-ui/react";
import OrderCard from "../components/ui/ordercard.js";
import { useColorModeValue } from "../components/ui/color-mode";
import { Button } from "../components/ui/button.js";
import bcrypt from 'bcryptjs'
import { toaster} from '../components/ui/toaster.js';
import {useItemStore} from '../store/item.js'

const PendingOrders= ()=> {
    const {getPendingOrders, orders, updateOTP}= useOrderStore();
    const navigate= useNavigate();
    const [otpdata, setotpdata]=useState({});
    const {fetchItems, items}= useItemStore();

    useEffect(()=> {
        const fetchData= async()=> {
            const token =localStorage.getItem("token");
            if(!token){
                navigate("/");
            };
            await getPendingOrders();
        }
        fetchData();
    }, [getPendingOrders,navigate])

    const handleitempage=async(product)=> {
        console.log(product);
        const args={itemId: product.ItemID};
        const {success, message, data}= await fetchItems(args);
        if(!success){
            toaster.create({
                title: "Error",
                description: message,
                type: "error",
            })
        } else{
            const product=data[0];
            console.log(product);
            if(product){
                navigate(`/search/${product.ItemID}`,{state: {product}});
            }
        }
    }

    const handlegetOTP=async(product)=>{
        try{
            const otp= Math.floor(100000 + Math.random()* 900000).toString();
            const hashedOTP= await bcrypt.hash(otp,10);
            const args={_id: product._id, hashedOTP: hashedOTP};
            const {success,message}= await updateOTP(args);
            if(success){
                toaster.create({
                title: "Success",
                description: message,
                type: "success"
                });
                setotpdata((prev)=> ({...prev, [product._id]: otp}));
            } else{
                toaster.create({
                title: "Error",
                description: message,
                type: "error",
                })
            }

        } catch(err){
            toaster.create({
                title: "Error",
                description: err.message,
                type: "error",
            })
        }
    }

    return(
        <div>
            <Container maxW={"container.sm"}>
                <VStack borderSpacing={8}>
                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                        Pending Orders
                    </Heading>
                    <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3,}} w={"full"} >
                            {orders.map((product) => (
                                <Container>
                                    <Box onClick={()=>{handleitempage(product)}} >
					                    <OrderCard item={product} />
                                    </Box>
                                    <Button bg={useColorModeValue("gray.200","black")} p={6} rounded={"lg"} shadow={"md"} onClick={()=>handlegetOTP(product)}>
                                        <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")}>
                                           Generate OTP
                                        </Text>
                                    </Button>
                                    {otpdata[product._id] && (
                                        <Text mt={2} fontSize="lg" fontWeight="bold" color={useColorModeValue("green.700", "green.400")} textAlign="center">
                                            OTP: {otpdata[product._id]}
                                        </Text>
                                    )}
                                </Container>
				            ))}
                        </SimpleGrid>
                        {orders.length===0 && (
                            <Text fontSize='xl' textAlign={"center"} fontWeight='bold'>
                            No pending Orders {" "}
                            </Text>
                        )}
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default PendingOrders;