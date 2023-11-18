import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form, Input } from "antd";
import { FormInput } from "./FormInput";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface ContractFormProps {

}

type Inputs = {
  name: string,
  description: string,
  charityAddress: string,
  tokenAddress: string,
}

interface CreateData {
  charityAddress: string,
  tokenAddress: string,
  name: string,
  description: string
}

const NoActiveRaffleForm = () => {
  const {
    handleSubmit,
    control,
    setValue
  } = useForm<Inputs>({
    defaultValues: {
      name: "Unicef Raffle win $1,000,000",
      description: "Unicef Raffle win money while also planting trees!",
      charityAddress: "0xF8C6715F80b2652a3C9AEE7beC0e20fDf3C91823",
      tokenAddress: "0x10490A621De7924d1c743232EBE2ae637fEe2364"
    }
  })
  const { mutate: initPool } = useMutation({
    mutationFn: async (args: CreateData) => {
      const data = await axios.post("/api/initPool", { ...args });
      return data;
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { name, description, charityAddress, tokenAddress } = data;
    initPool({
      charityAddress,
      tokenAddress,
      name,
      description
    })
  };

  return (
    <div className='w-full' >
      <h2 className="mb-2">Raffle not yet initialised</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="flex flex-col my-4">
          <FormInput
            control={control}
            name="name"
            label=""
          >
            <Input
              className="w-full"
              placeholder="Unicef Climate Change"
              required
              onChange={(e) => setValue("name", e.target.value)}
            />
          </FormInput>
          <FormInput
            control={control}
            name="charityAddress"
            label=""
          >
            <Input
              className="w-full"
              placeholder="Charaty Wallet Address"
              required
              onChange={(e) => setValue("charityAddress", e.target.value)}
            />
          </FormInput>
          <FormInput
            control={control}
            name="tokenAddress"
            label=""
          >
            <Input
              className="w-full"
              placeholder="TokenAddress of the raffle."
              required
              onChange={(e) => setValue("tokenAddress", e.target.value)}
            />
          </FormInput>
        </div>
        <div className="flex mt-4">
          <Form.Item className="mb-[5px]">
            <Button htmlType='submit' className="h-9 w-52">Create a new raffle</Button>
          </Form.Item>
        </div>
      </form>
    </div>
  )
}

export default NoActiveRaffleForm