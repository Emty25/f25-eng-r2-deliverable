/* eslint-disable */
import OpenAI from "openai";
// HINT: You'll want to initialize your service outside of the function definition
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function generateResponse(message: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert specializing in animal species. Politely decline any question not related to animals, saying you can only answer animal-related queries.",
        },
        { role: "user", content: message },
      ],
    });
    if (!completion.choices?.[0]?.message?.content) {
      return "Sorry, something went wrong. Please try again later.";
    }
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API", error);
    return "Sorry, something went wrong. Please try again later.";
  }
}
