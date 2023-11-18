import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Form, Input, Select } from "antd";
import { FormInput } from "./FormInput";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

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

const charities = [
  { address: "0xF8C6715F80b2652a3C9AEE7beC0e20fDf3C91823", name: "Unicef" },
  { address: "0x59078E00f6207aa89258264D4b160770732b41FA", name: "Team Trees" },
  { address: "0x81af1BD3FC77EE13756FffF345F198751C7a0EA0", name: "Ronald Mc'Donald House" }
]

const tokens = [
  { address: "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f", name: "GHO" },
  { address: "0x3506424f91fd33084466f402d5d97f05f8e3b4af", name: "CHZ" },
  { address: "0x10490A621De7924d1c743232EBE2ae637fEe2364", name: "TT" },
  { address: "0x779877A7B0D9E8603169DdbD7836e478b4624789", name: "LINK" }
]


const NoActiveRaffleForm = () => {
  const {
    handleSubmit,
    control,
    setValue
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      description: "",
      charityAddress: "",
      tokenAddress: ""
    }
  })
  const { mutate: initPool, isLoading } = useMutation({
    mutationFn: async (args: CreateData) => {
      const data = await axios.post("/api/initPool", { ...args });
      console.log(data);
      return data;
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { name, description, charityAddress, tokenAddress } = data;
    if (name && description && charityAddress && tokenAddress) {
      initPool({
        charityAddress,
        tokenAddress,
        name,
        description
      })
    }
  };

  return (
    <div className='w-full' >
      <h2 className="mb-2 text-2xl text-center">Set up new raffle</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="flex flex-col my-4">
          <FormInput
            control={control}
            name="name"
            label=""
          >
            <label htmlFor="name" className="text-white">
              Charity Raffle Name
              <Input
                disabled={isLoading}
                className="w-full"
                placeholder="Unicef Climate Change"
                required
                onChange={(e) => setValue("name", e.target.value)}
              />
            </label>
          </FormInput>
          <FormInput
            control={control}
            name="description"
            label=""
          >
            <label htmlFor="description" className="text-white">
              Charity description
              <Input
                disabled={isLoading}
                className="w-full"
                placeholder="For every ticket we plant a tree.."
                required
                onChange={(e) => setValue("description", e.target.value)}
              />
            </label>
          </FormInput>
          <FormInput
            control={control}
            name="charityAddress"
            label=""
          >
            <label htmlFor="charityAddress" className="text-white">
              Charity to support
              <Controller
                name="charityAddress"
                disabled={isLoading}
                control={control}
                render={({ field }) => (
                  <Select {...field} onChange={(value) => {
                    field.onChange(value);
                    setValue("charityAddress", value);
                  }}>
                    {charities.map(charity => (
                      <Select.Option key={charity.address} value={charity.address}>{charity.name}</Select.Option>
                    ))}
                  </Select>
                )}
              />
            </label>
          </FormInput>
          <FormInput
            control={control}
            name="tokenAddress"
            label=""
          >
            <label htmlFor="tokenAddress" className="text-white">
              Raffle Token
              <Controller
                name="tokenAddress"
                disabled={isLoading}
                control={control}
                render={({ field }) => (
                  <Select {...field} onChange={(value) => {
                    field.onChange(value);
                    setValue("tokenAddress", value);
                  }}>
                    {tokens.map(token => (
                      <Select.Option key={token.address} value={token.address}>{token.name}</Select.Option>
                    ))}
                  </Select>
                )}
              />
            </label>
          </FormInput>
        </div>
        <div className="flex mt-4 w-full">
          <Form.Item className="mb-[5px] w-full">
            <Button loading={isLoading} htmlType='submit' className="h-9 w-full">Create a new raffle</Button>
          </Form.Item>
        </div>
      </form>
    </div>
  )
}

export default NoActiveRaffleForm