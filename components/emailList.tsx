import { useEffect, useState } from 'react';

type Email = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
};

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
          <li key={email.id}>
            <h2>{email.subject}</h2>
            <p>{email.from}</p>
            <p>{email.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;
