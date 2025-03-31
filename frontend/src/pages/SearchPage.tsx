import { Button } from '../components/ui/button'
import { useColorModeValue } from '../components/ui/color-mode'
import { Box, Container, Heading, Input, VStack, HStack, useCheckboxGroup, SimpleGrid, Text} from '@chakra-ui/react'
import { MenuContent, MenuRoot, MenuTrigger, MenuCheckboxItem, MenuItemGroup  } from '../components/ui/menu'
import { useState, useEffect } from 'react'
import { useItemStore} from '../store/item.js'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ui/itemcard.js'

const SearchPage = () => {
    const group = useCheckboxGroup({ defaultValue: [""] });
    const [searchName, setSearchName] = useState('');
    const navigate= useNavigate();

    const {fetchItems, items}= useItemStore();

    useEffect(()=> {
        const token =localStorage.getItem("token");
        if(!token){
        navigate("/profile");
        }
    })

    const cats = [
        { title: "Books", value: "Books" },
        { title: "Appliances", value: "Appliances" },
        { title: "Electronics", value: "Electronics" },
        { title: "Clothing", value: "Clothing" },
        { title: "Footwear", value: "Footwear" },
        { title: "Accessories", value: "Accessories" },
        { title: "Home Decor", value: "HomeDecor" },
        { title: "Furniture", value: "Furniture" },
        { title: "Toys", value: "Toys" },
        { title: "Sports Equipment", value: "SportsEquipment" },
        { title: "Groceries", value: "Groceries" },
        { title: "Stationery", value: "Stationery" },
        { title: "Jewelry", value: "Jewelry" },
        { title: "Automotive", value: "Automotive" },
        { title: "Gardening", value: "Gardening" },
        { title: "Musical Instruments", value: "MusicalInstruments" },
        { title: "Art Supplies", value: "ArtSupplies" },
        { title: "Pet Supplies", value: "PetSupplies" },
        { title: "Health & Wellness", value: "HealthAndWellness" },
        { title: "Kitchenware", value: "Kitchenware" },
        { title: "Travel Accessories", value: "TravelAccessories" },
        { title: "Gaming", value: "Gaming" },
        { title: "Fitness", value: "Fitness" },
        { title: "Photography", value: "Photography" },
        { title: "Software", value: "Software" },
    ];

    const handleSearch= async()=> {
        const categories= group.value.join(",");
        await fetchItems({categories, searchName: searchName});
    }

    const handleItemPage= async(product)=> {
        navigate(`/search/${product._id}`,{state: {product}});
    }

  return (
    <div>
        <Container maxW={"container.sm"}>
            <VStack borderSpacing={8}>
                <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                    Search Items
                </Heading>
                <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                    <HStack borderSpacing={4}>
                        <MenuRoot>
                            <MenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Categories
                                </Button>
                            </MenuTrigger>
                            <MenuContent>
                                <MenuItemGroup title="Categories">
                                    {cats.map(({ title, value }) => (
                                        <MenuCheckboxItem
                                            key={value}
                                            value={value}
                                            checked={group.isChecked(value)}
                                            onCheckedChange={() => group.toggleValue(value)}
                                        >
                                        {title}
                                        </MenuCheckboxItem>
                                    ))}
                                </MenuItemGroup>
                            </MenuContent>
                        </MenuRoot>
                        <Input placeholder='Enter items' name='Search' onChange={(e) => setSearchName(e.target.value )} bg={useColorModeValue("white","gray.800")}/>
                        <Button  m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleSearch}>
                            Search
                        </Button>
                    </HStack>
                </Box>
            </VStack>
        </Container>
        <Container maxW={"container.xl"} py={12}>
            <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3,}} w={"full"} >
				    {items.map((product) => (
                        <Box onClick={()=> handleItemPage(product)}>
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
        </Container>
    </div>
  )
}

export default SearchPage