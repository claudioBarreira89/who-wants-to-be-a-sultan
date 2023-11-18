import RaffleMessages from '@/components/RaffleMessages';
import {
  useW3iAccount,
  useInitWeb3InboxClient,
} from '@web3inbox/widget-react'
import { useCallback, useEffect } from 'react'
import { useSignMessage, useAccount } from 'wagmi'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

export default function inbox() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const isReady = useInitWeb3InboxClient({
    projectId,
    domain: appDomain,
    isLimited: process.env.NODE_ENV == "production",
  })

  const { setAccount, register } = useW3iAccount()
  useEffect(() => {
    if (!address) return
    setAccount(`eip155:1:${address}`)
  }, [address, setAccount])

  const performRegistration = useCallback(async () => {
    if (!address) return
    try {
      await register(message => signMessageAsync({ message }))
    } catch (registerIdentityError) {
      alert(registerIdentityError)
    }
  }, [signMessageAsync, register, address])

  useEffect(() => {
    performRegistration()
  }, [performRegistration])

  return (
    <>
      {!isReady ? (
        <div>Loading client...</div>
      ) : (
        <>
          {!address ? (
            <div>Connect your wallet</div>
          ) : (
            <RaffleMessages />
          )}
        </>
      )}
    </>
  )
}