import { Box, Heading, Text, HStack, Image } from "@chakra-ui/react";
import { useColorModeValue } from './color-mode'
import { useNavigate } from 'react-router-dom'
import { IconButton } from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

const ProductCard= ({ item })=> {
    const navigate= useNavigate();

    const handleEdit= async()=> {
        navigate(`/updateItem/${item._id}`,{state: {item}});
    }
    const handleDelete= async()=> {
        navigate(`/deleteItem/${item._id}`,{state: {item}});
    }
    return(
        <div>
            <Image src={item.image} alt={item.Name} w={"full"} h={48} objectFit={"cover"} />
            <Box p={4} bg={useColorModeValue("white","gray.800")}>
                <Heading as='h2' size='xl' mb={4}>
                    {item.Name}
                </Heading>
                <Text fontWeight='bold' fontSize='l'mb={2}>
                    Rs.{item.Price}
                </Text>
                <Text fontWeight='bold' fontSize='l'mb={2}>
                    Description: {item.Description}
                </Text>
                <Text fontWeight='bold' fontSize='l'mb={2}>
                    Category: {item.Category}
                </Text>
                <Text fontWeight='bold' fontSize='l'mb={2}>
                    Stock: {item.Stock}
                </Text>
                <HStack >
                    <Box onClick={()=> handleEdit()}>
                        <IconButton variant={"solid" } colorPalette={"blue"}>
                            <MdEdit/>
                        </IconButton>
                    </Box>
                    <Box onClick={()=> handleDelete()}>
                        <IconButton variant={"solid"} colorPalette={"red"} >
                            <MdDelete/>
                        </IconButton>
                    </Box>
                </HStack>
            </Box>
        </div>
    )
}

export default ProductCard;
