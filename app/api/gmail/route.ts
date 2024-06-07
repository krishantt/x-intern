import { gmail_v1, google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import base64 from "base-64";
import { JSDOM } from "jsdom";
import { IEmail, ParseGmailApi } from "gmail-api-parse-message-ts";

const getEmails = async (
  messages: gmail_v1.Schema$Message[],
  gmail: gmail_v1.Gmail
) => {
  const emailList: IEmail[] = [];

  // Collect all promises
  const emailPromises = messages.map(async (m) => {
  
    const emailResponse = await gmail.users.messages.get({
      userId: "me",
      id: m.id as string,
    });
    console.log(emailResponse.data);
    const parse = new ParseGmailApi();
    const email: IEmail = parse.parseMessage(emailResponse.data);
    // console.log(email);

    emailList.push(email);
  });

  // Wait for all promises to resolve
  await Promise.all(emailPromises);

  return emailList;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.user.token });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10, // Adjust as needed
    });

    const messages = response.data.messages;
    if (!messages) {
      return NextResponse.json({ emailList: [] }, { status: 200 });
    }

    const emailList = await getEmails(messages, gmail);

    return NextResponse.json({ emailList: emailList }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

export { handler as GET };
