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

app.post("/slack/interactivity", (req, res) => {});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Read a token from the environment variables
