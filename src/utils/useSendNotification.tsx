import { useCallback, useState } from "react";
import { useW3iAccount } from "@web3inbox/widget-react";
import { INotification } from "./types";
import { sendNotification } from "./fetchNotify";
import { toast } from "react-toastify";

function useSendNotification() {
  const [isSending, setIsSending] = useState<boolean>(false);
  const { account } = useW3iAccount();

  const handleSendNotification = useCallback(
    async (notification: INotification, accounts?: string[]) => {
      if (!account) {
        return;
      }
      console.log(accounts);
      setIsSending(true);
      try {
        const { success, message } = await sendNotification({
          accounts: accounts || [account],
          notification,
        });

        setIsSending(false);
        toast[success ? 'success' : 'error'](success ? notification.title : "Message failed.");
      } catch (error: any) {
        setIsSending(false);
        console.error({ sendNotificationError: error });
        toast.error(error.message + " " + error.cause)
      }
    },
    [toast, account]
  );

  return {
    handleSendNotification,
    isSending,
  };
}

export default useSendNotification;
