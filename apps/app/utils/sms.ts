import SmsAndroid from "react-native-get-sms-android";
import { requestSmsPermission } from "./permissions";

/**
 * SMS Message object returned by react-native-get-sms-android
 *
 * This interface represents the structure of SMS messages retrieved from Android's SMS database.
 * The properties correspond to the columns in Android's Telephony.Sms.Inbox table.
 *
 * @see https://developer.android.com/reference/android/provider/Telephony.Sms.Inbox
 */
export type ISmsMessage = {
  /** Unique identifier for the SMS message in the Android SMS database */
  _id: number;

  /** Conversation thread identifier - groups related messages together */
  thread_id: number;

  /**
   * Sender's phone number or service identifier
   * Examples: "+1234567890", "CIB", "AMAZONIN", "16555"
   */
  address: string;

  /** Timestamp when the message was received (milliseconds since UNIX epoch) */
  date: number;

  /** Timestamp when the message was originally sent (milliseconds since UNIX epoch, 0 if not available) */
  date_sent: number;

  /** SMS protocol used for the message (0 = SMS_PROTO, 1 = SMS_PROTO_CDMA) */
  protocol: 0 | 1;

  /** Read status: 0 = unread, 1 = read */
  read: 0 | 1;

  /**
   * Message status in the Android SMS database:
   * -1 = STATUS_NONE (default/received successfully)
   * 0 = STATUS_COMPLETE
   * 32 = STATUS_PENDING
   * 64 = STATUS_FAILED
   */
  status: -1 | 0 | 32 | 64;

  /**
   * Message type:
   * 1 = MESSAGE_TYPE_INBOX (received)
   * 2 = MESSAGE_TYPE_SENT
   * 3 = MESSAGE_TYPE_DRAFT
   * 4 = MESSAGE_TYPE_OUTBOX
   * 5 = MESSAGE_TYPE_FAILED
   * 6 = MESSAGE_TYPE_QUEUED
   */
  type: 1 | 2 | 3 | 4 | 5 | 6;

  /** Whether a reply path is present for this message (0 = no, 1 = yes) */
  reply_path_present: 0 | 1;

  /**
   * Message subject (usually empty for SMS, used for MMS or enhanced messaging)
   * May contain protocol buffer data for RCS messages
   */
  subject: string;

  /** The actual text content of the SMS message */
  body: string;

  /** Whether the message is locked from deletion (0 = not locked, 1 = locked) */
  locked: 0 | 1;

  /**
   * Subscription ID for dual-SIM devices:
   * -1 = not applicable/unknown
   * 0 = SIM slot 0 (primary)
   * 1 = SIM slot 1 (secondary)
   * Can also be positive integers for carrier-specific IDs
   */
  sub_id: number;

  /**
   * Error code if message delivery failed:
   * -1 = no error
   * 0 = ERROR_GENERIC_FAILURE
   * 1 = ERROR_RADIO_OFF
   * 2 = ERROR_NULL_PDU
   * Other positive values indicate specific error types
   */
  error_code: number;

  /**
   * Application that created/handled the message
   * Examples: "com.google.android.apps.messaging", "com.android.mms"
   */
  creator: string;

  /** Whether the message has been seen by the user (0 = not seen, 1 = seen) */
  seen: 0 | 1;
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
