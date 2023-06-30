import { useState } from 'react'
import { connectKeplr } from '../services/keplr'
import { SigningCosmWasmClient, CosmWasmClient, JsonObject } from '@cosmjs/cosmwasm-stargate'
import { fromBase64, toBase64 } from '@cosmjs/encoding'
import {
  convertMicroDenomToDenom,
  convertDenomToMicroDenom,
  convertFromMicroDenom
} from '../util/conversion'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { create } from 'ipfs-http-client'
import { coin } from '@cosmjs/launchpad'

import { useNotification } from '../components/Notification'

export interface ISigningCosmWasmClientContext {
  walletAddress: string
  client: CosmWasmClient | null
  signingClient: SigningCosmWasmClient | null
  loading: boolean
  error: any
  connectWallet: Function,
  disconnect: Function,

  getConfig: Function,
  config: any,
  isAdmin: boolean,

  getBalances: Function,
  nativeBalanceStr: string,
  nativeBalance: number,

  executeStake: Function,
  executeUnStake: Function,
  executeReward: Function,
  executeRemoveTreasury: Function,


}

export const PUBLIC_CHAIN_RPC_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
export const PUBLIC_CHAIN_REST_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_REST_ENDPOINT || ''
export const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || ''
export const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'ujuno'
export const PUBLIC_STAKING_CONTRACT = process.env.NEXT_PUBLIC_STAKING_CONTRACT || ''
export const PUBLIC_STAKING_TOKEN_ADDR = process.env.NEXT_PUBLIC_STAKING_TOKEN_ADDRESS || ''

export const defaultFee = {
  amount: [],
  gas: "400000",
}


export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  const [client, setClient] = useState<CosmWasmClient | null>(null)
  const [signingClient, setSigningClient] = useState<SigningCosmWasmClient | null>(null)

  const [walletAddress, setWalletAddress] = useState('')
  const [maxAmountValue, setMaxAmountValue] = useState(1);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const [nativeBalanceStr, setNativeBalanceStr] = useState('')
  const [nativeBalance, setNativeBalance] = useState(0)

  const [config, setConfig] = useState({ owner: '', enabled: true, denom: null, treasury_amount: 0, flip_count: 0 })


  const { success: successNotification, error: errorNotification } = useNotification()

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////    connect & disconnect   //////////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  const showNotification = false;
  const notify = (flag: boolean, str: String) => {
    if (!showNotification)
      return;

    if (flag)
      NotificationManager.success(str)
    else
      NotificationManager.error(str)
  }
  const connectWallet = async (inBackground: boolean) => {
    if (!inBackground)
      setLoading(true)

    try {
      await connectKeplr()

      // enable website to access kepler
      await (window as any).keplr.enable(PUBLIC_CHAIN_ID)

      // get offline signer for signing txs
      const offlineSigner = await (window as any).getOfflineSignerOnlyAmino(
        PUBLIC_CHAIN_ID
      )

      // make client
      setClient(
        await CosmWasmClient.connect(PUBLIC_CHAIN_RPC_ENDPOINT)
      )

      // make client
      setSigningClient(
        await SigningCosmWasmClient.connectWithSigner(
          PUBLIC_CHAIN_RPC_ENDPOINT,
          offlineSigner
        )
      )

      // get user address
      const [{ address }] = await offlineSigner.getAccounts()
      setWalletAddress(address)

      localStorage.setItem("address", address)

      if (!inBackground) {
        setLoading(false)
        notify(true, "Connected Successfully")
      }
    } catch (error) {
      notify(false, `Connect error : ${error}`)
      if (!inBackground) {
        setLoading(false)
      }
    }
  }

  const disconnect = () => {
    if (signingClient) {
      localStorage.removeItem("address")
      signingClient.disconnect()

    }
    setIsAdmin(false)
    setWalletAddress('')
    setSigningClient(null)
    setLoading(false)
    notify(true, `Disconnected successfully`)
  }

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////    global variables    /////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  const getBalances = async () => {
    setLoading(true)
    getHoleAmount()
    try {
      const objectNative: JsonObject = await signingClient.getBalance(walletAddress, PUBLIC_STAKING_DENOM)
      setNativeBalanceStr(`${convertMicroDenomToDenom(objectNative.amount)} ${convertFromMicroDenom(objectNative.denom)}`)
      setNativeBalance(convertMicroDenomToDenom(objectNative.amount))
      setLoading(false)
      notify(true, `Successfully got balances`)
    } catch (error) {
      setLoading(false)
      notify(false, `GetBalances error : ${error}`)
    }
  }

  const getConfig = async () => {

    setLoading(true)
    try {
      const response: JsonObject = await signingClient.queryContractSmart(PUBLIC_STAKING_CONTRACT, {
        config: {}
      })
      setConfig(response)
      setIsAdmin(response.owner == walletAddress)
      setLoading(false)
      notify(true, `Successfully got config`)
    } catch (error) {
      setLoading(false)
      notify(false, `getConfig error : ${error}`)
    }
  }

  const getHoleAmount = async () => {
    return 100
    setLoading(true)

    const response = ""
    try {
      const response: JsonObject = await signingClient.queryContractSmart(PUBLIC_STAKING_CONTRACT, {
        get_hole_amount: {
          "address": walletAddress
        }
      })
      console.log("balance = ", response)
      setLoading(false)
    } catch (error) {

      setLoading(false)
      console.log("sdffffffffffffffffffffffffffffffffffffffffff", error)
      notify(false, `getConfig error : ${error}`)
    }
  }

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ///////////////    Execute Flip and Remove Treasury     ////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  const executeStake = async (level: string, index: number) => {
    setLoading(true)
    getHoleAmount()
    console.log("execute stake with = ", level)
    console.log("walletAddress=", walletAddress)
    console.log("index =  ", index)
    let result
    try {
      let encodedMsg: string = toBase64(new TextEncoder().encode(`{"stake": { "lock_type": 1 }}`))
      result = await signingClient?.execute(
        walletAddress, // sender address
        PUBLIC_STAKING_TOKEN_ADDR,
        {
          "send":
          {
            "contract": PUBLIC_STAKING_CONTRACT,
            "amount": convertDenomToMicroDenom(level),

            "msg": encodedMsg
          }
        }, // msg
        defaultFee,
        undefined,
        []
      )

      console.log("token_addr=", PUBLIC_STAKING_TOKEN_ADDR)
      console.log("contract_addr=", PUBLIC_STAKING_CONTRACT)
      console.log("result = ", result)
      setLoading(false)
      successNotification({ title: `Success`, txHash: result.transactionHash })
    } catch (error) {
      console.log("result = ", result)
      setLoading(false)
      errorNotification({ title: `Faild` })
      console.log(error)

    }

  }

  const executeUnStake = async () => {
    setLoading(true)
    console.log("execute Unstake with = ")
    console.log("walletAddress=", walletAddress)
    let result
    try {
      let encodedMsg: string = toBase64(new TextEncoder().encode(`{"stake": {}}`))
      result = await signingClient?.execute(
        walletAddress, // sender address
        PUBLIC_STAKING_CONTRACT,
        {
          "unstake":
          {
          }
        }, // msg
        defaultFee,
        undefined,
        []
      )
      successNotification({ title: `Success`, txHash: result.transactionHash })
      setLoading(false)
    } catch (error) {
      console.log("result = ", result)
      setLoading(false)
      errorNotification({ title: `UnStaking failed. No staking amount` })
      //console.log(error)
    }
  }
  const executeReward = async (reward) => {
    setLoading(true)
    let juno_flag = true;
    let ranking = 1

    try {
      const response: JsonObject = await signingClient.queryContractSmart(PUBLIC_STAKING_CONTRACT, {
        list_stakers: {}
      })

      let mystaking_amount = 0
      console.log("my wallet address ", walletAddress)
      console.log(response)
      if (response.stakers.length > 0) {
        for (let i = 0; i < response.stakers.length; i++) {
          if (response.stakers[i][0].address == walletAddress) {
            for (let j = 0; j < response.stakers[i].length; j++) {
              mystaking_amount += parseInt(response.stakers[i][0].amount)
            }
            break;
          }
        }
        if (mystaking_amount == 0) {
          errorNotification({ title: `Please stake with Hole token` })
          setLoading(false)
          return
        }
        console.log("my staking amount", mystaking_amount)
        for (let i = 0; i < response.stakers.length; i++) {
          let temp = 0
          if (response.stakers[i][0].address != walletAddress) {
            for (let j = 0; j < response.stakers[i].length; j++) {
              temp += parseInt(response.stakers[i][0].amount)
            }
            console.log("temp", temp)
            if (mystaking_amount <= temp)
              ranking++
          }
        }

      }
      console.log("ranking", ranking)

    } catch (error) {
      notify(false, `getConfig error : ${error}`)
      setLoading(false)
      return
    }
    successNotification({ title: `Current Rank ` + ranking })
    if (ranking > 3)
      juno_flag = false

    const params = {
      "claim_reward":
      {
        "distribution": {
          "juno_reward": juno_flag,
          "artists": reward[0],
          "burn": reward[1] - reward[0],
          "charity": reward[2] - reward[1],
        }
      }
    }

    let result
    try {

      result = await signingClient?.execute(
        walletAddress, // sender address
        PUBLIC_STAKING_CONTRACT, // token escrow contract
        params,
        defaultFee,
        undefined,

      )
      successNotification({ title: `Success`, txHash: result.transactionHash })
      console.log(result)
      setLoading(false)

    } catch (error) {
      console.log("result = ", result)
      errorNotification({ title: `Reward failed` })
      setLoading(false)

    }
  }

  const executeRemoveTreasury = async (amount: number) => {
    setLoading(true)
    let result
    try {

      result = await signingClient?.execute(
        walletAddress, // sender address
        PUBLIC_STAKING_CONTRACT, // token escrow contract
        {
          "remove_treasury":
          {
            "amount": `${parseInt(convertDenomToMicroDenom(amount), 10)}`,
          }
        }, // msg
        defaultFee,
        undefined,
        []
      )
      setLoading(false)
      getConfig()
      getBalances()
      if (result && result.transactionHash) {
        successNotification({ title: 'Remove Treasury Successful', txHash: result.transactionHash })
      }
      notify(true, 'Successfully executed')
    } catch (error) {
      setLoading(false)

    }
  }

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  return {
    walletAddress,
    signingClient,
    loading,
    error,
    connectWallet,
    disconnect,
    client,
    getConfig,
    config,
    isAdmin,


    getBalances,
    nativeBalanceStr,
    nativeBalance,

    executeStake,
    executeUnStake,
    executeReward,
    executeRemoveTreasury,
    getHoleAmount

  }
}
