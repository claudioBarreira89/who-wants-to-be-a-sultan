import { INotification } from "./types";

export const sendNotification = async (notificationPayload: {
  accounts: string[];
  notification: INotification;
}) => {
  console.log(notificationPayload);
  const result = await fetch("/api/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notificationPayload),
  });
  const gmRes = await result.json();
  console.log(gmRes);
  const { success, message } = gmRes;

  return { success, message };
};

export const getAllSubscribers = async (): Promise<string[]> => {
  const result = await fetch("/api/subscribers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const subscribersRes = await result.json();
  const { subscribers } = subscribersRes;
  console.log({ subscribers });

  return subscribers;
};
