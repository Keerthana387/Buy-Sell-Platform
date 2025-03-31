import { Button, Container, Flex, Text} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useColorMode, useColorModeValue } from './color-mode'
import { IoMoon } from 'react-icons/io5'
import { LuSun } from 'react-icons/lu'

const Navbar = () => {

    const {colorMode, toggleColorMode}= useColorMode();

  return (
    <Container maxH={"1140px"} px={4} bg={useColorModeValue("gray.300", "black")} shadow={"md"}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-around"} flexDir={{base: "column", sm: "row"}}>
            <Text fontSize={{ base: "22", sm: "28" }}
					fontWeight={"bold"}
					textTransform={"uppercase"}
					textAlign={"center"}
					bgGradient={"linear(to-r, cyan.400, blue.500)"}
                    bgClip={"content-box"}>
                <Link to={"/"}>Buy Sell IIITH 🛒</Link>
            </Text>
            <div>
                <Link to={"/profile"}>
                    Profile Page
                </Link>
            </div>
            <div>
                <Link to={"/search"}>
                    Search Items
                </Link>
            </div>
            <div>
                <Link to={"/orders/history"}>
                    Orders History
                </Link>
            </div>
            <div>
                <Link to={"/myitems"}>
                    My Items
                </Link>
            </div>
            <div>
                <Link to={"/deliveritems"}>
                    Deliver Items
                </Link>
            </div>
            <div>
                <Link to={"/cart"}>
                    My Cart
                </Link>
            </div>
            <div>
                <Button onClick={toggleColorMode}>
                    {colorMode === "light" ? <IoMoon />: <LuSun size={20}/>}
                </Button>
            </div>
        </Flex>
    </Container>
  )
}

export default Navbar