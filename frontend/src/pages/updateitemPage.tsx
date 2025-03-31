import { Button } from '../components/ui/button'
import { useColorModeValue } from '../components/ui/color-mode'
import { Box, Container, Heading, Input, VStack} from '@chakra-ui/react'
import { MenuContent, MenuRoot, MenuTrigger, MenuCheckboxItem, MenuItemGroup  } from '../components/ui/menu'
import { useState } from 'react'
import { useItemStore} from '../store/item.js'
import { toaster} from '../components/ui/toaster.js'
import { useNavigate, useLocation } from "react-router-dom";
import { items } from './createItemPage.js'

const UpdateItemPage= ()=> {
    const location= useLocation();
    const {item}= location.state || {};
    const {updateItem}= useItemStore();
    const [newItem, setNewItem]= useState({
        Name: "",
        Price: "",
        Description: "",
        Category: "",
        Stock: "",
    });
    const navigate= useNavigate();
    const handleEditItem= async()=> {
        const itemmm={...newItem, id:item._id}
        const {success,message}= await updateItem(itemmm);
        if(success){
            toaster.create({
                title: "Success",
                description: message,
                type: "success"
            })
            navigate("/myitems")
        } else{
            toaster.create({
                title: "Error",
                description: message,
                type: "error",
            })
        }
    }
    return(
        <div>
            <Container maxW={"container.sm"}>
                                <VStack borderSpacing={8}>
                                    <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                                        Edit Item
                                    </Heading>
                                    <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                                        <VStack borderSpacing={4}>
                                            <Input placeholder='Name' name='Name' value={newItem.Name} onChange={(e) => setNewItem({ ...newItem, Name: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                                            <Input placeholder='Price' name='Price' value={newItem.Price} onChange={(e) => setNewItem({ ...newItem, Price: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                                            <Input placeholder='Description' name='Description' value={newItem.Description} onChange={(e) => setNewItem({ ...newItem, Description: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                                            <Input placeholder='Stock' name='Stock' value={newItem.Stock} onChange={(e) => setNewItem({ ...newItem, Stock: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                                            <MenuRoot>
                                                <MenuTrigger asChild>
                                                    <Button variant="subtle" size="sm" bg={useColorModeValue("white","gray.800")}>
                                                        {newItem.Category || "Select Category"}
                                                    </Button>
                                                </MenuTrigger>
                                                <MenuContent>
                                                    <MenuItemGroup title="Categories">
                                                        {items.map(({ title, value }) => (
                                                            <MenuCheckboxItem
                                                                key={value}
                                                                value={value}
                                                                checked={newItem.Category === value}
                                                                onCheckedChange={() => setNewItem({...newItem, Category: value})}
                                                            >
                                                            {title}
                                                            </MenuCheckboxItem>
                                                        ))}
                                                    </MenuItemGroup>
                                                </MenuContent>
                                            </MenuRoot>
                                            <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleEditItem}>
                                                Edit
                                            </Button>
                                        </VStack>
                                    </Box>
                                </VStack>
                            </Container>
        </div>
    )
}

export default UpdateItemPage;