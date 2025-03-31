import { Box, Heading, Text} from "@chakra-ui/react";
import { useColorModeValue } from './color-mode'

const OrderCard= ({ item })=> {
    return(
        <div>
            <Box p={4} bg={useColorModeValue("white","gray.800")}>
                <Heading as='h2' size='xl' mb={4}>
                    {item.ItemName}
                </Heading>
                <Text fontWeight='bold' fontSize='l'mb={2}>
                    Rs.{item.Amount}
                </Text>
                <Text fontWeight='bold' fontSize='l'mb={2}>
                    Seller: {item.SellerFirstName} {item.SellerLastName}
                </Text>
            </Box>
        </div>
    )
}

export default OrderCard;