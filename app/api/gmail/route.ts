import { gmail_v1, google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import base64 from 'base-64';
import { JSDOM } from 'jsdom';

const getEmails = async (messages: gmail_v1.Schema$Message[], gmail: gmail_v1.Gmail) => {
    const emailList: Array<{ subject: string, sender: string, body: string, snippet: string }> = [];
  
    // Collect all promises
    const emailPromises = messages.map(async (m) => {
      const email = await gmail.users.messages.get({ userId: "me", id: m.id as string });
    //   console.log(email.data);
  
      try {
        const payload = email.data.payload;
        const headers = payload?.headers;
        const snippet = email.data.snippet as string
        
        let subject = '';
        let sender = '';
  
        for (const header of headers!) {
          if (header.name === 'Subject') {
            subject = header.value as string;
          } else if (header.name === 'From') {
            sender = header.value as string;
          }
        }
  
        const parts = payload?.parts?.[0];
        const data = parts?.body?.data;
  
        if (data) {
          const decodedData = base64.decode(data.replace(/-/g, '+').replace(/_/g, '/'));
          const dom = new JSDOM(decodedData);
          const body = dom.window.document.body.textContent || '';
  
          emailList.push({ subject, sender, body, snippet });
        }
      } catch (error) {
        console.error('Error processing email:', error);
      }
    });
  
    // Wait for all promises to resolve
    await Promise.all(emailPromises);
  
    return emailList;
  }
  

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
