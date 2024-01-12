'use client'

//React
import { useState, useEffect } from "react"

//wagmi
import { useAccount, usePublicClient } from "wagmi"
import { readContract, watchContractEvent } from "@wagmi/core"

//chakra UI
import { Alert, AlertIcon } from "@chakra-ui/react"

//constant and types
import { contractAddress, abi } from "@/constants"
import {Contributor} from "@/types"

//Components
import Contribute from "./Contribute"
import Progression from "./Progression"
import Contributors from "./Contributors"
import Refund from "./Refund"

//viem
import { ParseAbiItem, Log, parseAbiItem } from "viem"



const Pool = () => {
    const client = usePublicClient()
    const {address, isConnected} =useAccount()

    const [end, setEnd]= useState<string>('')
    const [goal, setGoal]= useState<string>('')
    const [totalCollected, setTotalCollected]= useState<string>('')
    const [isLoading, setIsLoading]= useState<boolean>(false)

    const [event, setEvent]= useState<Contributor[]>([])

    const getDatas = async() => {
        if(isConnected){
            setIsLoading(true)
            //get end Date of the Pool
            let data: any = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'end'
            })
            //date management *1000 car java millisecond
            let date = new Date(parseInt(data) * 1000)
            let day = date.getDate()
            let month= date.getMonth() + 1
            let year = date.getFullYear()
            let endDate: string = day + "/" + month + "/"+ year
            setEnd(endDate)

            //Goal
            data = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'goal'
            })
            setGoal(data.toString())

            //TotalCollected
            data = await readContract({
                address: contractAddress,
                abi: abi,
                functionName: 'totalCollected'
            })
            setTotalCollected(data.toString())

            //Get Event de pool
            const ContributeLogs = await client.getLogs({
                address: contractAddress,
                event: parseAbiItem('event Contribute(address indexed contributor, uint256 amount)'),
                fromBlock: 0n,
                toBlock: 'latest'
            })
            //puis setEvent
            setEvent(ContributeLogs.map(
                log => ({
                    contributor: log.args.contributor as string,
                    amount: (log.args.amount as bigint).toString()
                })
            ))

            setIsLoading(false)
        }
    }

    //recupere les datas une fois connecte
    useEffect(() => {getDatas()}, [address])
    return (
        //cherche a savoir si wallet connecte
        <> 
            {isConnected ? (
                <> 
                    <Progression isLoading={isLoading} end={end} goal={goal} totalCollected={totalCollected} />
                    <Contribute getDatas={getDatas}/>
                    <Refund getDatas={getDatas} end={end} goal={goal} totalCollected={totalCollected} />
                    <Contributors events={event}/>
                </>
            ): (
                <Alert status="warning">
                    <AlertIcon />
                    Please connect your wallet
                </Alert>
            )}
        </>
    )
}

export default Pool