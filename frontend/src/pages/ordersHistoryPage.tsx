import { Tabs, Text } from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import PendingOrders from "./pendingOrdersPage";
import BoughtHistory from "./boughtHistory";
import SoldHistory from "./soldHIstory";

const OrdersHistoryPage= ()=> {
    return (
        <div>
            <Tabs.Root defaultValue="members" variant="plain" m={8} alignSelf={"center"}>
                <Tabs.List bg="bg.muted" rounded="l3" p="1">
                    <Tabs.Trigger value="members">
                        <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")}>
                            Pending Orders
                        </Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="projects">
                        <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")}>
                            Items Bought
                        </Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="tasks">
                        <Text fontSize='xl' textAlign={"center"} fontWeight='bold' color={useColorModeValue("black","white")}>
                            Items Sold
                        </Text>
                    </Tabs.Trigger>
                    <Tabs.Indicator rounded="l2" />
                </Tabs.List>
                 <Tabs.Content value="members"><PendingOrders /></Tabs.Content>
                <Tabs.Content value="projects"><BoughtHistory/></Tabs.Content>
                <Tabs.Content value="tasks"><SoldHistory/></Tabs.Content>
            </Tabs.Root>
        </div>
    )
}

export default OrdersHistoryPage;