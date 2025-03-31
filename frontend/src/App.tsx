import { Box } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/ui/navbar"
import ProfilePage from "./pages/ProfilePage"
import { useColorModeValue } from "./components/ui/color-mode"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import SearchPage from "./pages/SearchPage"
import CreateItemPage from "./pages/createItemPage"
import LoginPage from "./pages/loginPage"
import UpdateProfilePage from "./pages/updateprofilePage"
import ItemPage from "./pages/itemPage"
import MyCartPage from "./pages/MyCartPage"
import MyItemsPage from "./pages/MyItemsPage"
import UpdateItemPage from "./pages/updateitemPage"
import DeleteItemPage from "./pages/deleteItemPage"
import OrdersHistoryPage from "./pages/ordersHistoryPage"
import DeliverItemsPage from "./pages/DeliverItems"
import WriteReviewPage from "./pages/writeReviewPage"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <Box minH={"100vh"} bg={useColorModeValue("white", "gray.900")}>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/search/:id" element={<ItemPage/>}/>
        <Route path="/createItem" element={<CreateItemPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/profile/update" element={<UpdateProfilePage />}/>
        <Route path="/cart" element={<MyCartPage/>}/>
        <Route path="/myitems" element={<MyItemsPage/>}/>
        <Route path="/orders/history" element={<OrdersHistoryPage/>}/>
        <Route path="/updateItem/:id" element={<UpdateItemPage/>}/>
        <Route path="/deleteItem/:id" element={<DeleteItemPage/>}/>
        <Route path="/deliveritems" element={<DeliverItemsPage/>}/>
        <Route path="/writereview" element={<WriteReviewPage/>}/>
      </Routes>
    </Box>
  )
}

export default App
