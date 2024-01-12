'use client'
//types
import { ContributorsProps } from "@/types"

//chakra UI
import { Flex, Heading, Card, CardBody, Text } from "@chakra-ui/react"

//Viem
import { formatEther, parseEther } from "viem"


const Contributors = ({events}:ContributorsProps) => {
  return (//creation d'un tableau de contributeur
    <>
        <Heading mt="2rem">
            Contributors
        </Heading>
        <Flex mt="1rem" direction='column'>
            {events.map((event) =>{
                return(
                    <Card mb=".5rem" key={crypto.randomUUID()}>
                        <CardBody>
                            <Flex justifyContent="space-between" alignItems="center">
                                <Text>{event.contributor}</Text>
                                <Text>{formatEther(BigInt(event.amount))} ETH</Text>
                            </Flex>
                        </CardBody>
                    </Card>
                )
            })}
        </Flex>
    </>
  )
}

export default Contributors