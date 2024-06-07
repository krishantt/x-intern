import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { IEmail } from 'gmail-api-parse-message-ts';


const EmailCard = ({ ...props }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.email.subject}</CardTitle>
        <CardDescription>
          <div className='flex flex-row justify-between'>
            <div>{props.email.from.name} | {props.email.from.email}</div>
            <div>{new Date(props.email.sentDate).toDateString()}</div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>{props.email.snippet}</CardContent>
      <CardFooter>{props.email.id}</CardFooter>
    </Card>
  );
}

const EmailDrawer = ({ ...props }) => {
  return (
    <Drawer>
      <DrawerTrigger>
        <EmailCard {...props} />
      </DrawerTrigger>
      <DrawerContent>
        
          <DrawerHeader>
            <DrawerTitle>{props.email.subject}</DrawerTitle>
            <DrawerDescription >
              <div className='flex flex-row justify-between'>
                <div>{props.email.from.name} | {props.email.from.email}</div>
                <div>{new Date(props.email.sentDate).toDateString()}</div>
              </div>
            </DrawerDescription>
          </DrawerHeader>
      

        <p dangerouslySetInnerHTML={{ __html: props.email.textHtml }}></p>
      </DrawerContent>
    </Drawer>
  );

}


const EmailList = () => {
  const [emails, setEmails] = useState<IEmail[]>([]);

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
    <div className='space-y-10'>
      {emails.length === 0 && <p>No emails found.</p>}

      {emails.map((email) => (
        <EmailDrawer email={email} key={email.id} />
      ))}

    </div>
  );
};

export default EmailList;
