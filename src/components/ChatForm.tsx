import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Form, Input } from "antd";
import { FormInput } from "./FormInput";
import useSendNotification from "@/utils/useSendNotification";
import { useAccount } from "wagmi";

type Inputs = {
  text: string;
};

const ChatForm = ({ isSubscribed, subscribers }: { isSubscribed: boolean, subscribers?: string[] }) => {
  const { address } = useAccount();
  const { handleSubmit, control, setValue, formState: { isSubmitting } } = useForm<Inputs>({
    defaultValues: {
      text: "",
    },
  });

  function shortenAddress(address: string) {
    if (!address || address.length < 9) {
      return address; // Return the original address if it's too short
    }
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  }

  const { handleSendNotification, isSending } = useSendNotification();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { text } = data;
    if (!text || !isSubscribed || !address) return;

    handleSendNotification({
      title: shortenAddress(address || ""),
      body: text,
      icon: window.location.origin,
      url: window.location.origin,
      type: "aa613359-dc43-4a3c-8753-14349ced4a32",
    }, subscribers || [address]);

    setValue("text", "")
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-1 mt-4">
        <div className="h-fit">
          <FormInput control={control} name="text" label="" className="!m-0">
            <Input
              disabled={isSubmitting}
              className="w-full m-0"
              placeholder="Type something cool"
              required
              onChange={(e) => setValue("text", e.target.value)}
            />
          </FormInput>
        </div>
        <div className="h-fit">
          <Form.Item className="w-full !m-0">
            <Button
              loading={isSubmitting}
              htmlType="submit"
              className="w-full bg-primary hover:opacity-90 font-bold text-white border-0 hover:!text-white"
            >
              {isSubmitting ? "Sending.." : "Send"}
            </Button>
          </Form.Item>
        </div>
      </form>
    </>
  )
}

export default ChatForm