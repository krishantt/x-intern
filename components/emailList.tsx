"use client";
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
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IEmail } from 'gmail-api-parse-message-ts';
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';

interface EmailCardProps {
  email: IEmail;
}

const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const [emailLabel, setEmailLabel] = useState<string>("");

  useEffect(() => {
    const labels = window.localStorage.getItem("classify") || "{}";
    const classify = JSON.parse(labels);
    const email_ = classify?.object?.result.find((e: { id: string }) => e.id === email.id);
    const label = email_ ? email_.label : "";
    setEmailLabel(label);
  }, []);


  return (
    <Card>
      <CardHeader>
        <CardTitle>{email.subject}</CardTitle>
        <CardDescription>
          <div className="flex flex-row justify-between">
            <div>{email.from.name} | {email.from.email}</div>
            <div>{new Date(email.sentDate).toDateString()}</div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>{email.snippet}</CardContent>
      <CardFooter><Badge>{emailLabel}</Badge></CardFooter>
    </Card>
  );
};

const EmailDrawer: React.FC<EmailCardProps> = ({ email }) => {
  return (
    <Drawer>
      <DrawerTrigger>
        <EmailCard email={email} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{email.subject}</DrawerTitle>
          <DrawerDescription>
            <div className="flex flex-row justify-between">
              <div>{email.from.name} | {email.from.email}</div>
              <div>{new Date(email.sentDate).toDateString()}</div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <p dangerouslySetInnerHTML={{ __html: email.textHtml }}></p>
      </DrawerContent>
    </Drawer>
  );
};

interface EmailListProps {
  emails: IEmail[];
}

const EmailList: React.FC<EmailListProps> = ({ emails }) => {
  return (
    <div className="space-y-10">
      {emails.length === 0 && <p>No emails found.</p>}
      {emails.map((email) => (
        <EmailDrawer email={email} key={email.id} />
      ))}
    </div>
  );
};

export default EmailList;
