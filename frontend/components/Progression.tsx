'use client'

//constant et type
import { contractAddress,abi } from "@/constants"
import {ProgresionProps} from "@/types"

//ReactJS
import {useState} from 'react'

//wagmi
import { useAccount } from "wagmi"

//ckakra UI
import { Text, Progress, Heading, Spinner } from "@chakra-ui/react"

//viem
import { formatEther } from "viem"

const Progression = ({isLoading, end, goal, totalCollected}: ProgresionProps) => {

    const{address, isConnected} = useAccount()
    return (//barre dr progression
        <>
            {isLoading ? <Spinner/>:(
                <>
                    <Heading mb='1rem'>Progression</Heading>
                    <Text mb='.5rem'><Text as= 'span' fontWeight='bold'>End date</Text> {end}</Text>
                    <Progress 
                        colorScheme={(parseInt(totalCollected)/parseInt(goal)) * 100 < 100 ? 'red' : 'green'}
                        height='32px'
                        value={(parseInt(totalCollected)/parseInt(goal)) * 100}
                        hasStripe
                    />
                    <Text mt='.5rem'>
                        {Number(formatEther(BigInt(totalCollected))).toFixed(2)} ETH / {Number(formatEther(BigInt(goal))).toFixed(2)} ETH
                    </Text>
                </>
            )}
        </>
    )
}

export default Progression