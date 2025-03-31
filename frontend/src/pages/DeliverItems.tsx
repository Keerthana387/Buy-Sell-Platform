import { useEffect, useState } from "react";
import {useOrderStore} from '../store/order.js'
import { useNavigate } from 'react-router-dom'
import { Container, Heading,VStack,Box,SimpleGrid,Text, Input } from "@chakra-ui/react";
import OrderCard from "../components/ui/ordercard_2.js";
import { useColorModeValue } from "../components/ui/color-mode";
import { Button } from "../components/ui/button.js";
import { toaster} from '../components/ui/toaster.js'

const DeliverItemsPage=()=> {

    const {getdeliverorders, deliverorders, checkOTP, closetrans}= useOrderStore();
    const [OTP,setOTP]= useState({});
    const [isOTPValid, setIsOTPValid] = useState({});
    const navigate= useNavigate();
    useEffect(()=> {
        const fetchData= async()=> {
            const token =localStorage.getItem("token");
            if(!token){
            navigate("/");
            };
            await getdeliverorders();
        }
        fetchData();
    }, [getdeliverorders,navigate])

    const handlecheckOTP=async(product)=>{
        const args={otp: OTP[product._id], id: product._id}
        const {success, message}= await checkOTP(args);
        if(success){
            setIsOTPValid((prev) => ({ ...prev, [product._id]: true }));
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

    const handleclosetrans=async(product)=> {
        const {success,message}= await closetrans(product._id);
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

    return (
        <div>
            <Container maxW={"container.sm"}>
                <VStack borderSpacing={8}>
                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                        Deliver Items
                    </Heading>
                    <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3,}} w={"full"} >
                            {deliverorders.map((product) => (
                                <Container>
                                    <VStack>
                                    <Box >
					                    <OrderCard item={product} />
                                    </Box>
                                    <Input placeholder='OTP' name='OTP' value={OTP[product._id]} onChange={(e) => setOTP((prev)=> ({...prev, [product._id]: e.target.value}))} bg={useColorModeValue("white","gray.800")}/>
                                    <Button bg={useColorModeValue("white","gray.800")} p={6} rounded={"lg"} shadow={"md"}  onClick={()=>{handlecheckOTP(product)}}>
                                        <Text fontSize='l' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")}>
                                            Check OTP
                                        </Text>
                                    </Button>
                                    <Button bg={useColorModeValue("white","gray.800")} p={6} rounded={"lg"} shadow={"md"} disabled={!isOTPValid[product._id]} onClick={()=>{handleclosetrans(product)}}>
                                        <Text fontSize='l' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")}>
                                            Close Transaction
                                        </Text>
                                    </Button>
                                    </VStack>
                                </Container>
				            ))}
                        </SimpleGrid>
                        {deliverorders.length===0 && (
                            <Text fontSize='xl' textAlign={"center"} fontWeight='bold'>
                                No Items to Deliver {" "}
                            </Text>
                        )}
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default DeliverItemsPage;