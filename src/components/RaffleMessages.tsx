import { Button } from 'antd';
import React from "react";
import {
  useManageSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages
} from '@web3inbox/widget-react'
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useCallback, useEffect } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import useSendNotification from '@/utils/useSendNotification';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

function RaffleMessages() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { account, setAccount, isRegistered, isRegistering, register } = useW3iAccount()
  const { messages, deleteMessage } = useMessages(account);

  const isReady = useInitWeb3InboxClient({
    projectId,
    domain: appDomain,
    isLimited: process.env.NODE_ENV == "production",
  })

  useEffect(() => {
    if (!address) return
    setAccount(`eip155:1:${address}`)
  }, [address, setAccount])

  const performRegistration = useCallback(async () => {
    if (!address) return
    try {
      await register(message => signMessageAsync({ message }))
    } catch (registerIdentityError) {
      // alert(registerIdentityError)
    }
  }, [signMessageAsync, register, address])

  useEffect(() => {
    performRegistration()
  }, [performRegistration])

  const { isSubscribed, isSubscribing, subscribe, unsubscribe } = useManageSubscription()

  const performSubscribe = useCallback(async () => {
    await performRegistration()
    await subscribe()
  }, [subscribe, isRegistered])

  const { handleSendNotification, isSending } = useSendNotification();

  // handleSendNotification will send a notification to the current user and includes error handling.
  // If you don't want to use this hook and want more flexibility, you can use sendNotification.
  const handleTestNotification = useCallback(async () => {
    if (isSubscribed) {
      handleSendNotification({
        title: "GM Hacker",
        body: "Hack it until you make it!",
        icon: `${window.location.origin}/notification.png`,
        url: window.location.origin,
        // ID retrieved from explorer api - Copy your notification type from WalletConnect Cloud and replace the default value below
        type: "5472094a-3ac1-4483-a861-26aef4ca05ae",
      });
    }
  }, [handleSendNotification, isSubscribed]);
  // const { subscription } = useSubscription()
  // sendMessage(`The event has been called in a smart contract ${address}`, eventName)

  return (
    <div className='h-full w-full relative'>
      <h2 className="mb-6 text-xl">Last Messages</h2>
      {!isReady ? (
        <div>Loading client...</div>
      ) : (
        <>
          {!address || !isSubscribed ? (
            <div>
              {address ? <Button
                className="w-full mb-2 bg-primary hover:opacity-90 hover:!bg-primary font-bold"
                onClick={performSubscribe}
                type='primary'
                loading={isSubscribing}
                disabled={!Boolean(address) || !Boolean(account)}
              >
                Allow to send events
              </Button> :
                "please connect your wallet"}
            </div>
          ) : (
            <div className="w-full">
              <div className="flex flex-col space-y-4 w-full">
                {!messages?.length ? (
                  <p>No messages yet.</p>
                ) : (
                  messages
                    .sort((a, b) => b.id - a.id)
                    .map(({ id, message }) => (
                      <div
                        key={id}
                        className={`rounded-xl bg-green-50 border-1 border p-3 relative`}
                      >
                        <div className='flex flex-col gap-5 mr-4 max-w-[250px]'>
                          <div>
                            <div className="flex flex-col">
                              <h3 className='font-bold text-black' >{message.title}</h3>
                              <p className='break-all	text-black'>{message.body}</p>
                            </div>
                          </div>
                          <Button
                            className="delete-btn p-base absolute top-1 right-1"
                            type='text'
                            icon={<AiOutlineClose />}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(id);
                              toast.success("Message deleted");
                            }}
                          />
                        </div>
                      </div>
                    ))
                )}
                <Button
                  type="primary"
                  onClick={handleTestNotification}
                  loading={isSending}
                >
                  Send test notification
                </Button>
                <Button
                  onClick={unsubscribe}
                  type="primary"
                  className="bg-red-500 hover:!bg-red-400 absolute bottom-0 left-0 right-0"
                  disabled={!isReady || !account}
                  loading={isSubscribing}
                >
                  Unsubscribe from events
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RaffleMessages;
