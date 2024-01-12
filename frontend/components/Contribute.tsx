'use client'

//chakraUI
import { Flex, Text, Input, Button, Heading, useToast } from "@chakra-ui/react"

//React
import { useState } from "react"

//Constants and type
import { contractAddress, abi } from "@/constants"
import{ContributeProps} from "@/types"

//Viem
import { parseEther } from "viem"

//wagmi 
import { prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core"

const Contribute = ({getDatas}: ContributeProps) => {
    const toast = useToast()

    const[amount, setAmount] = useState<string>('')
    const Contribute =async() =>{
        try{
            await getDatas()
            let money = parseEther(amount)
            const {request} = await
            prepareWriteContract({
                address: contractAddress,
                abi: abi,
                functionName: 'contribute',
                value: money
            })
            const {hash} = await writeContract (request)
            const data = await waitForTransaction({
                hash: hash
            })
            //pop up reussite + reinitialisation champ
            setAmount('');
            //des que maj donne envoye temps reel
            await getDatas()
            toast({
                title: 'Bravo.',
                description: "Contribution complete",
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
            Contribute
        </Heading>
        <Flex mt='1rem'>
            <Input
                placeholder="Your amount of Eth"
                size='lg'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <Button colorScheme="green" size='lg' onClick={() => Contribute()}> 

            </Button>
        </Flex>
    </>
  )
}

export default Contribute