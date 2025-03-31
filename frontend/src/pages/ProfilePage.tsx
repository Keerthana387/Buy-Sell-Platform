import { Box, Container, Heading, VStack, Text, SimpleGrid} from '@chakra-ui/react'
import { useColorModeValue } from '../components/ui/color-mode'
import { Avatar} from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { useUserStore } from '../store/user.js'
import {useReviewStore} from '../store/review.js'
import { useEffect , useState} from 'react'
import { toaster} from '../components/ui/toaster.js'
import { useNavigate } from 'react-router-dom'
import ReviewCard from '../components/ui/ReviewCard.js'

const ProfilePage = () => {
  const [userinfo, setuserinfo]= useState({
    First_Name: "",
    Last_Name: "",
    Email: "",
    Age: "",
    Contact_Number: "",
  })
  const { fetchUserInfo, logoutUser }=useUserStore();
  const {reviews,getreviews} =useReviewStore();
  const navigate= useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { success, message, data } = await fetchUserInfo(); 
      if (success) {
        setuserinfo({
          First_Name: data.First_Name,
          Last_Name: data.Last_Name,
          Email: data.Email,
          Age: data.Age,
          Contact_Number: data.Contact_Number,
        });
      } else {
        if(message.includes("No token found")){
          navigate("/");
        } else{
          console.error("Failed to fetch user info:", message);
          toaster.create({
            title: "Error",
            description: message,
            type: "error",
          })
        }
      }
      await getreviews();
    };

    fetchData();
  }, [fetchUserInfo]);

  const handleLogoutUser= async()=> {
    const {success,message}= await logoutUser();
    if(success){
      toaster.create({
        title: "Success",
        description: message,
        type: "success"
      })
      navigate("/");
    } else{
      console.error("Failed to Logout:", message);
      toaster.create({
        title: "Error",
        description: message,
        type: "error",
      })
    }
  }

  const handleUpdate= async()=> {
    navigate("/profile/update")
  }

  return (
    <div>
      <Container maxW={"container.sm"}>
        <VStack borderSpacing={8}>
          <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
            Profile
          </Heading>
          <Box w={"-moz-fit-content"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
            <VStack borderSpacing={4}>
              <Avatar name={userinfo.Last_Name} size={"2xl"}/>
              <Text fontSize={"xl"}>First Name: {userinfo.First_Name} </Text>
              <Text fontSize={"xl"}>Last Name: {userinfo.Last_Name} </Text>
              <Text fontSize={"xl"}>Email: {userinfo.Email} </Text>
              <Text fontSize={"xl"}>Age: {userinfo.Age} </Text>
              <Text fontSize={"xl"}>Contact Number: {userinfo.Contact_Number} </Text>
              <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleLogoutUser}>
                Logout
              </Button>
              <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleUpdate}>
                Edit Profile
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
      <Container maxW={"container.xl"} py={12}>
        <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3,}} w={"full"} >
            {reviews.map((product) => (
              <Box >
                <ReviewCard review= {product} />
              </Box>
				    ))}
			    </SimpleGrid>
            {reviews.length===0 && (
              <Text fontSize='xl' textAlign={"center"} fontWeight='bold'>
                No reviews found {" "}
              </Text>
            )}
        </Box>
      </Container>
    </div>
  )
}

export default ProfilePage