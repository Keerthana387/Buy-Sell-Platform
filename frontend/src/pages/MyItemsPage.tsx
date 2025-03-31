import { useColorModeValue } from "../components/ui/color-mode";
import { Container, Heading, VStack, Box, SimpleGrid, Text } from "@chakra-ui/react";
import { Button } from "../components/ui/button.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useItemStore} from '../store/item.js';
import ProductCard from "../components/ui/itemcard_2.js";

const MyItemsPage= ()=> {
    const navigate= useNavigate();
    const {items, fetchItems}= useItemStore();

    useEffect(()=> {
        const fetchData= async()=> {
            const token =localStorage.getItem("token");
            if(!token){
                navigate("/");
            };
            await fetchItems({sellerId: "none"});
        }
        fetchData();
    }, [navigate, fetchItems])

    const handleadditem= async()=> {
        navigate("/createItem");
    }
    return(
        <div>
            <Container maxW={"container.sm"}>
                <VStack borderSpacing={8}>
                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                        My Items
                    </Heading>
                    <Button bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"} onClick={()=>handleadditem()}>
                        <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")}>
                            Create New Item
                        </Text>
                    </Button>
                    <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3,}} w={"full"} >
                            {items.map((product) => (
                                <Box>
					                <ProductCard item={product} />
                                </Box>
				            ))}
                        </SimpleGrid>
                        {items.length===0 && (
                            <Text fontSize='xl' textAlign={"center"} fontWeight='bold'>
                            No products found {" "}
                            </Text>
                        )}
                    </Box>
                </VStack>
            </Container>
        </div>
    )
}

export default MyItemsPage;