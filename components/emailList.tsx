import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Email = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
};

const EmailCard  = (email : Email, key:string) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{email.subject}</CardTitle>
        <CardDescription>{email.from}</CardDescription>
      </CardHeader>
      <CardContent>{email.snippet}</CardContent>
      <CardFooter>{email.id}</CardFooter>
    </Card>
  );
}


const EmailList = () => {
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('/api/gmail');
        const data = await response.json();
        setEmails(data.emailList);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div>
      <h1>Your Emails</h1>
      <ul>
        {emails.map((email) => (
          <EmailCard email={email} key={email.id}/>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;
