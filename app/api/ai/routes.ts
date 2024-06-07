import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from "next/server";

const openai = createOpenAI({
    // custom settings, e.g.
    compatibility: 'strict',
    apiKey: localStorage.getItem('apiKey') as string, // strict mode, enable when using the OpenAI API
});



// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { emails } = req.body;

  const { object } = await generateObject({
    model: openai("gpt-3.5-turbo-instruct"),
    schema: z.object({
      result: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
        })
      ),
    }),
    prompt: `You are given number of emails data. 
        Based on the data, classify the emails into different labels,
         only under the following labels: 
         Important: Emails that are personal or work-related and require immediate attention.
        Promotions: Emails related to sales, discounts, and marketing campaigns.
        Social: Emails from social networks, friends, and family.
        Marketing: Emails related to marketing, newsletters, and notifications.
        Spam: Unwanted or unsolicited emails.
        General: If none of the above are matched, use General.
        ${emails}`,
  });

  // Example response with labels
  const labels = ["Important", "Work", "Personal"];

  NextResponse.json({ object }, { status: 200 });
};

export { handler as POST };
