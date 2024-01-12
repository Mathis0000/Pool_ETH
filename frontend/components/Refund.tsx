'use client'
//type
import {refundProps} from "@/types"

//chakra UI
import { Flex, Text, Button, Heading, useToast } from "@chakra-ui/react"

//consatant
import { contractAddress, abi } from "@/constants"
//viem
import { parseEther } from "viem"
//wagmi
import { prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core"

const Refund = ({getDatas, end, goal, totalCollected}:refundProps) => {
    const toast = useToast()

    const refund =async() =>{
        try{
            const {request} = await
            prepareWriteContract({
                address: contractAddress,
                abi: abi,
                functionName: 'refund',
            })
            const {hash} = await writeContract (request)
            const data = await waitForTransaction({
                hash: hash
            })
            //pop up reussite
            //des que maj donne envoye temps reel
            await getDatas()
            toast({
                title: 'Bravo.',
                description: "You have been refunded",
                status: 'success',
                duration: 4000,
                isClosable: true,
              })
        }catch(e){
            toast({
                title: 'Error',
                description: "There is an error",
                status: 'error',
                duration: 4000,
                isClosable: true,
              })
        }
    }

    return (
        <>
            <Heading mt='2rem'>
                Refund
            </Heading>
            
            <Flex mt='1rem'>
                {parseInt(totalCollected)<parseInt(goal) && Math.floor (Date.now() / 1000) > parseInt(end) ? (
                    <Button colorScheme="red" size="lg" width='100%' onClick={() => refund()}> </Button>
                ) : (
                    <Text color='red' >No refund is available right no </Text>
                )}
            </Flex>
        </>
    )
}

export default Refund