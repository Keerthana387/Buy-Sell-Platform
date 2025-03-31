import { Button } from '../components/ui/button'
import { useColorModeValue } from '../components/ui/color-mode'
import { Box, Container, Heading, Input, VStack} from '@chakra-ui/react'
import { useState } from 'react'
import { useItemStore} from '../store/item.js'
import { toaster} from '../components/ui/toaster.js'
import { MenuContent, MenuRoot, MenuTrigger, MenuCheckboxItem, MenuItemGroup  } from '../components/ui/menu'


export const items = [
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

const CreateItemPage = () => {

    const [newItem, setNewItem]= useState({
        Name: "",
        Price: "",
        Description: "",
        Category: "",
        Stock: "",
        isActive: true,
        image: "",
    });

    const [ImageFile, setImageFile]= useState<File | undefined>();

    const handleImageChange=(e)=> {
        const file= e.target.files[0];
        if(file){
            setImageFile(file);
        }
    };

    const uploadImage= async()=> {
        const formData= new FormData();
        formData.append("image", ImageFile);
        try {
            const response = await fetch("http://localhost:5000/api/uploads", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                return data.data;  // The URL to store in your database
            } else {
                throw new Error("Failed to upload image");
            }
        } catch (err) {
            console.error("Error uploading image:", err);
            toaster.create({
                title: "Error",
                description: `${err.message}`,
                type: "error",
            });
            return null;
        }
    }

    const {createItem}=useItemStore();

    const handleAddItem= async()=> {
    
        const imageUrl= await uploadImage();
        if(!imageUrl){
            toaster.create({
                title: "Error",
                description: "Image upload failed!",
                type: "error",
            })
            return;
        }
        const item={...newItem, image: imageUrl};

        const {success,message}= await createItem(item);
        console.log("Success: ", success);
        console.log("Message:", message);
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

  return (
    <div>
                <Container maxW={"container.sm"}>
                    <VStack borderSpacing={8}>
                        <Heading as={"h1"} size={"2xl"} textAlign={"center"} m={8}>
                            Create Item
                        </Heading>
                        <Box w={"full"} bg={useColorModeValue("gray.300","black")} p={6} rounded={"lg"} shadow={"md"}>
                            <VStack borderSpacing={4}>
                                <Input placeholder='Name' name='Name' value={newItem.Name} onChange={(e) => setNewItem({ ...newItem, Name: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                                <Input placeholder='Price' name='Price' value={newItem.Price} onChange={(e) => setNewItem({ ...newItem, Price: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                                <Input placeholder='Description' name='Description' value={newItem.Description} onChange={(e) => setNewItem({ ...newItem, Description: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                                <Input placeholder='Stock' name='Stock' value={newItem.Stock} onChange={(e) => setNewItem({ ...newItem, Stock: e.target.value })} bg={useColorModeValue("white","gray.800")}/>
                                <Input placeholder='Image' name='Image' type="file" accept="image/*" onChange={handleImageChange} bg={useColorModeValue("white", "gray.800")} />
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
                                <Button w={"full"} m={6} bg={useColorModeValue("gray.600","gray.400")} onClick={handleAddItem}>
                                    Add Item
                                </Button>
                            </VStack>
                        </Box>
                    </VStack>
                </Container>
            </div>
  )
}

export default CreateItemPage