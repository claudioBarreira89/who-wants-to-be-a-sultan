const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

const notifyApiSecret = process.env.NOTIFY_API_SECRET;
if (!notifyApiSecret) {
  throw new Error("You need to provide NOTIFY_API_SECRET env variable");
}

const sendMessage = async (message: string, eventName: string) => {
  console.log("message");
  console.log(message);
  try {
    const result = await fetch(
      `https://notify.walletconnect.com/${projectId}/notify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${notifyApiSecret}`,
        },
        body: JSON.stringify({
          notification: {
            type: "5472094a-3ac1-4483-a861-26aef4ca05ae",
            title: `Event ${eventName} was executed`,
            body: message,
            icon: `https://gazton.vercel.app/notification.png`,
            url: "https://gazton.vercel.app/",
          },
          accounts: [
            'eip155:1:0xB3622628546DE921A70945ffB51811725FbDA109' // TODO: change to be more flexible
          ]
        }),
      }
    );

    const gmRes = await result.json();
    console.log(gmRes);
  } catch (err) {
    console.error(err);
  }
}

