import { Box, Heading, Text} from "@chakra-ui/react";
import { useColorModeValue } from './color-mode'

const ReviewCard= ({review})=> { 
    return(
        <div>
            <Box p={4} bg={useColorModeValue("white","gray.800")}>
                <Heading as='h2' size='xl' mb={4}>
                    Rating: {review.rating}/5
                </Heading>
                <Text fontWeight='bold' fontSize='l'mb={2}>
                    Comment: {review.comment}
                </Text>
            </Box>
        </div>
    )
}

export default ReviewCard;