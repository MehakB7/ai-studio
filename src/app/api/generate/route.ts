import { NextResponse } from "next/server";

const generateIds = () => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
};

const getId = generateIds();

export async function POST(req: Request) {
  const { prompt, imageDataUrl, style } = await req.json();

  const interval = Math.floor(Math.random() * 1000) + 1000;

  return new Promise((resolve) => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        resolve(
          NextResponse.json({ error: "Model Overloaded" }, { status: 429 })
        );
        return;
      }

      resolve(
        NextResponse.json({
          id: getId(),
          prompt,
          imageUrl: imageDataUrl,
          style,
          status: "success",
          created_at: new Date(),
        })
      );
    }, interval);
  });
}
