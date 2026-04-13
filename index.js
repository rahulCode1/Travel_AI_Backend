import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import OpenAi from "openai";
import express from "express";
import cors from "cors";

const app = express();
const MODEL = "deepseek/deepseek-v3.2";
const API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const client = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: API_KEY,
});

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are an AI travel agent. Your task is to generate structured travel recommendations.

Return ONLY valid JSON. Do not include explanations, text, markdown, or formatting outside JSON.
IMPORTANT: Your response must start with { and end with } no backticks.
Follow this EXACT schema and field names:

{
  "destination": "string (format: city, country)",
  "best_time": "string (months or season + one short reason)",
  "duration_days": number,
  "top_attractions": ["string", "string", "string"],
  "sample_itinerary": [
    { "day": number, "plan": "string" }
  ],
  "estimated_budget_eur": {
    "low": number,
    "mid": number,
    "high": number
  },
  "local_tips": ["string", "string"]
}

STRICT RULES:
- Output must be valid JSON (parsable with JSON.parse)
- Do NOT include trailing commas
- Do NOT include comments
- Do NOT rename or add fields
- Do NOT prose, markdown, or backticks
- Ensure correct spelling of all keys (e.g., "sample_itinerary", "estimated_budget_eur")
- Use integers for all numbers (no strings)
- Provide at least 3 days in "sample_itinerary"
- Keep arrays non-empty when possible
- If data is unavailable, use null or []
- IMPORTANT: Your response must start with { and end with } no backticks.

QUALITY GUIDELINES: 
- Be realistic and geographically accurate
- Keep descriptions concise but useful
- Ensure itinerary flows logically day-by-day
- Budget should reflect a per-person estimate in EUR

`;

// const main = async () => {
//   const res = await axios.post(
//     API_URL,
//     {
//       model: MODEL,
//       messages: [
//         {
//           role: "system",
//           content: SYSTEM_PROMPT,
//         },
//         {
//           role: "user",
//           content: User_Prompt,
//         },
//       ],
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     },
//   );

//   console.log(res.data?.choices[0]?.message?.content);
// };

// main();

const main = async () => {
  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: USER_PROMPT,
      },
    ],
  });

  console.log("Response from AI:", res?.choices?.[0]?.message?.content);
};

// main();

app.get("/", async (req, res) => {
  return res.json({ success: true });
});

app.get("/travel-planner", async (req, res) => {
  const { destination, duration } = req.query;

  const USER_PROMPT = `
Create a short travel plan for a first-time visitor.

Destination: ${destination}
Duration: ${duration} days

Focus on:
- Must-see attractions
- A logical day-by-day itinerary
- Beginner-friendly experiences
- Balanced pace (not too rushed)

Ensure the plan is realistic for the given number of days.
`;

  try {
    const sdkRes = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: USER_PROMPT,
        },
      ],
    });

    const data = JSON.parse(sdkRes?.choices?.[0]?.message?.content);
    return res.json(data);
   
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
