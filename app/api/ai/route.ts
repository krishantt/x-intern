import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

// IMPORTANT! Set the runtime to edge
// export const runtime = "edge";

const handler = async (req: Request) => {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  const { emails, apiKey } = await req.json();
  // console.log(apiKey)

  const openai = createOpenAI({
    // custom settings, e.g.
    compatibility: "strict",
    apiKey: apiKey, // strict mode, enable when using the OpenAI API
  });
  const prompt = `You are given number of emails data. 
  Based on the data, classify the emails into different labels,
   only under the following labels: 
   Important: Emails that are personal or work-related and require immediate attention.
  Promotions: Emails related to sales, discounts, and marketing campaigns.
  Social: Emails from social networks, friends, and family.
  Marketing: Emails related to marketing, newsletters, and notifications.
  Spam: Unwanted or unsolicited emails.
  General: If none of the above are matched, use General.
  Use id same as of email in the result array.
  ${JSON.stringify(emails)}`;
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        result: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
          })
        ),
      }),
      prompt: prompt,
    });
    console.log(prompt)
    return NextResponse.json({ object }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
