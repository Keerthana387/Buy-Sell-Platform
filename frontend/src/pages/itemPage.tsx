import { useLocation } from "react-router-dom";
import { Box, Container,VStack,Text,Heading, Image } from "@chakra-ui/react";
import { Button } from "../components/ui/button";
import { useColorModeValue } from "../components/ui/color-mode";
import { useUserStore } from '../store/user.js'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster} from '../components/ui/toaster.js'

const ItemPage=()=> {
    const location= useLocation();
    const {fetchSellerInfo, AddToCart}= useUserStore();
    const {product}= location.state;
    const [seller,setseller]= useState({
        First_Name: "",
        Last_Name: "",
        Email: "",
        Age: "",
        Contact_Number: "",
    })
    const navigate= useNavigate();

    useEffect(()=> {
        const fetchData= async()=> {
            const token =localStorage.getItem("token");
            if(!token){
                navigate("/profile");
            };
            const {success,message,data}= await fetchSellerInfo(product.SellerID);
            if(success){
                setseller({...seller, First_Name: data.First_Name, Last_Name: data.Last_Name, Email: data.Email, Age: data.Age, Contact_Number: data.Contact_Number});
            } else{
                toaster.create({
                    title: "Error",
                    description: message,
                    type: "error",
                })
            }
        }
        fetchData();
    }, [product, navigate, seller,fetchSellerInfo]);

    const addtocart= async()=> {
        const {success,message}= await AddToCart(product);
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

    if(!product){
        return(
            <Container>
                <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                    <Text fontSize={"xl"}> No Product found</Text>
                </Box>
            </Container>
        )
    }
    return(
        <div>
            <Container maxW={"container.sm"}>
                <VStack borderSpacing={8}>
                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                        Item Page
                    </Heading>
                    <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <VStack borderSpacing={4}>
                            <Image src={product.image} alt={product.Name} w={"full"} h={48} objectFit={"cover"} />
                            <Text fontSize={"xl"}>{product.Name} </Text>
                            <Text fontSize={"xl"}>Price: Rs.{product.Price} </Text>
                            <Text fontSize={"md"}>{product.Description} </Text>
                            <Text fontSize={"xl"}>In Stock: {product.Stock} </Text>
                            <Text fontSize={"xl"}>Category: {product.Category} </Text>
                            <Text fontSize={"xl"}>Seller: {seller.First_Name} {seller.Last_Name} </Text>
                            <Text fontSize={"md"}>Contact Info: {seller.Email} {seller.Contact_Number} </Text>
                            <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={addtocart} disabled={!product.isActive}>
                                Add To Cart
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default ItemPage;