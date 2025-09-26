import SmsAndroid from "react-native-get-sms-android";
import { requestSmsPermission } from "./permissions";

export type ISmsMessage = {
  _id: number;
  thread_id: number;
  address: string;
  body: string;
  date: number;
  read: number;
};

export interface IFilter {
  box: "inbox" | "sent" | "draft" | "outbox" | "failed" | "queued" | "";
  minDate: number; // timestamp (in milliseconds since epoch)
  maxDate: number; // timestamp (in milliseconds since epoch)
  bodyRegex: string; // content regex to match
  read: number; // 0 for unread SMS, 1 for SMS that has been read
  _id: number | null; // specific SMS id
  thread_id: number | null; // specify the conversation thread_id
  address: string; // sender's phone number
  body: string; // content to match
  indexFrom: number; // start from index 0
  maxCount: number; // count of SMS to return each time
}

export async function getInboxMessages(
  filter: Partial<IFilter>
): Promise<ISmsMessage[] | null> {
  const hasPermission = await requestSmsPermission();
  if (!hasPermission) return null;

  return new Promise((resolve, reject) => {
    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: string) => reject(new Error(fail)),
      (count: number, smsList: string) => {
        const messages: ISmsMessage[] = JSON.parse(smsList);
        resolve(messages);
      }
    );
  });
}
