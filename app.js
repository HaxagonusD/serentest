import express from "express";
import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

// making sure the app works
// const result = web.auth.test({ token });
// result.then((response) => console.log(response));

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/hello", (req, res) => {
  console.log(req.body);
  const { channel_id, user_id } = req.body;
  console.log("Channel Name: ", channel_id);
  console.log("User ID: ", user_id);
  res.status(200).json({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Welcome. How are your doing?",
        },
      },
    ],
  });

  const response = web.chat.postEphemeral({
    attachments: [],
    channel: channel_id,
    text: "Welcome. How are you doing?",
    user: user_id,
    blocks: [
      {
        type: "actions",
        elements: [
          {
            type: "static_select",
            action_id: "feeling",
            placeholder: { type: "plain_text", text: "How are you doing?" },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Doing Well",
                },
                value: "Doing Well",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Neutral",
                },
                value: "Neutral",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Feeling Lucky",
                },
                value: "Feeling Lucky",
              },
            ],
          },
        ],
      },
    ],
  });

  response
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
});

app.post("/slack/interactive", (req, res) => {
  let { payload } = req.body;
  payload = JSON.parse(payload);

  console.log("Parsed Payload ", payload);
  res.status(200).end();
  const whichResponse = {
    feeling: () => {
      web.chat
        .postMessage({
          channel: payload.container.channel_id,
          attachments: [],
          text: "When are you free for a walk?",
          user: payload.user.id,
          blocks: [
            {
              type: "section",
              text: {
                type: "plain_text",
                text: "What time are you free for a walk?\n",
              },
              accessory: {
                action_id: "time",
                type: "multi_static_select",
                max_selected_items: 2,
                placeholder: {
                  type: "plain_text",
                  text: "Time",
                },
                options: [
                  {
                    text: { type: "plain_text", text: "12:00" },
                    value: "12:00",
                  },
                  {
                    text: { type: "plain_text", text: "12:30" },
                    value: "12:30",
                  },
                  {
                    text: { type: "plain_text", text: "13:00" },
                    value: "13:00",
                  },
                  {
                    text: { type: "plain_text", text: "13:30" },
                    value: "13:30",
                  },
                  {
                    text: { type: "plain_text", text: "14:00" },
                    value: "14:00",
                  },
                  {
                    text: { type: "plain_text", text: "14:30" },
                    value: "14:30",
                  },
                  {
                    text: { type: "plain_text", text: "15:00" },
                    value: "15:00",
                  },
                  {
                    text: { type: "plain_text", text: "15:30" },
                    value: "15:30",
                  },
                  {
                    text: { type: "plain_text", text: "16:00" },
                    value: "16:00",
                  },
                  {
                    text: { type: "plain_text", text: "16:30" },
                    value: "16:30",
                  },
                  {
                    text: { type: "plain_text", text: "17:00" },
                    value: "17:00",
                  },
                  {
                    text: { type: "plain_text", text: "17:30" },
                    value: "17:30",
                  },
                  {
                    text: { type: "plain_text", text: "18:00" },
                    value: "18:00",
                  },
                ],
              },
            },
            {
              type: "section",
              text: {
                type: "plain_text",
                text: " What day are you free for a walk?\n",
              },
              accessory: {
                type: "multi_static_select",
                placeholder: { type: "plain_text", text: "Select a Day" },
                action_id: "day",
                options: [
                  {
                    text: { type: "plain_text", text: "Monday" },
                    value: "Monday",
                  },
                  {
                    text: { type: "plain_text", text: "Tuesday" },
                    value: "Tuesday",
                  },
                  {
                    text: { type: "plain_text", text: "Wednesday" },
                    value: "Wednesday",
                  },
                  {
                    text: { type: "plain_text", text: "Thursday" },
                    value: "Thursday",
                  },
                  {
                    text: { type: "plain_text", text: "Friday" },
                    value: "Friday",
                  },
                  {
                    text: { type: "plain_text", text: "Saturday" },
                    value: "Saturday",
                  },
                  {
                    text: { type: "plain_text", text: "Sunday" },
                    value: "Sunday",
                  },
                ],
              },
            },
          ],
        })
        .catch((err) => console.log(err));
    },
    time: () => {
      /*save response to the database*/
    },
    day: () => {},
    hobbies: () => {},
    numbers: () => {},
  };

  whichResponse[payload.actions[0].action_id]
    ? whichResponse[payload.actions[0].action_id]()
    : res.status(500);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Read a token from the environment variables
