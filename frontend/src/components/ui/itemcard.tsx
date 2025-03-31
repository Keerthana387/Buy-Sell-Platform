import { Box, Heading, Text, Image } from "@chakra-ui/react";
import { useColorModeValue } from './color-mode'

const ProductCard= ({ item })=> {
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
            </Box>
        </div>
    )
}

export default ProductCard;
