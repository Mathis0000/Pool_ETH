'use client'

//components
import Header from "./Header"
import Footer from "./Footer"

//chakra UI
import { Flex } from '@chakra-ui/react';

//types
import { LayoutChildreProps } from "@/types";

export const Layout = ({children}: LayoutChildreProps) => {
    return(
        <Flex height='100vh' direction="column" justifyContent="space-between" alignItems='center'>
            <Header />
            <Flex p='2rem' direction='column' width='100%'>
                {children}
            </Flex>
            <Footer />
        </Flex>
    )
}