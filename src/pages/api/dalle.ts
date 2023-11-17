// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI();

type Data = {
  imageUrl: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const image = await openai.images.generate({
    model: "dall-e-2",
    prompt: "sultan of swing honeypot",
    n: 1,
    size: "512x512",
  });
  const imageUrl = image.data[0].url || "";
  console.log(`Image URL is ${imageUrl}`);
  res.status(200).json({ imageUrl });
}
