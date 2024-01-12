'use client'
//rainbowKit
import { ConnectButton } from '@rainbow-me/rainbowkit';

//chakra UI
import { Flex, Text } from '@chakra-ui/react';
import { celo } from 'viem/chains';

const Header = () => {
  return (
    <Flex p='2rem' justifyContent={'space-between'} alignItems={'center'} width= '100%'>
        <Text as ='b'>Logo</Text> 
        <ConnectButton />
    </Flex>
  )
}

export default Header