import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { AIProviders, Chat, Intention } from "@/types";
import { IntentionModule } from "@/modules/intention";
import { ResponseModule } from "@/modules/response";
import { PINECONE_INDEX_NAME } from "@/configuration/pinecone";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

// Get API keys
const pineconeApiKey = process.env.PINECONE_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const fireworksApiKey = process.env.FIREWORKS_API_KEY;

// Check if API keys are set
if (!pineconeApiKey) {
  throw new Error("PINECONE_API_KEY is not set");
}
if (!openaiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

// Initialize Pinecone
const pineconeClient = new Pinecone({
  apiKey: pineconeApiKey,
});
const pineconeIndex = pineconeClient.Index(PINECONE_INDEX_NAME);

// Initialize Providers
const openaiClient = new OpenAI({
  apiKey: openaiApiKey,
});
const anthropicClient = new Anthropic({
  apiKey: anthropicApiKey,
});
const fireworksClient = new OpenAI({
  baseURL: "https://api.fireworks.ai/inference/v1",
  apiKey: fireworksApiKey,
});
const providers: AIProviders = {
  openai: openaiClient,
  anthropic: anthropicClient,
  fireworks: fireworksClient,
};

async function determineIntention(chat: Chat): Promise<Intention> {
  return await IntentionModule.detectIntention({
    chat: chat,
    openai: providers.openai,
  });
}

async function generateWorkoutResponse(): Promise<string> {
  return `
    <div class="workout-card">
      <h2 class="text-xl font-bold">🏋️ Strength Workout Plan</h2>
      <p class="text-muted-foreground">Here’s your strength-focused workout:</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Warm-Up (5 min)</strong>: Jumping Jacks, Arm Circles, Walking Lunges, Dynamic Stretches</li>
        <li><strong>Workout (30-40 min)</strong>: 
          <ul class="list-disc pl-5">
            <li><strong>Deadlifts:</strong> 6-8 reps</li>
            <li><strong>Bench Press:</strong> 6-8 reps</li>
            <li><strong>Pull-Ups:</strong> 6-8 reps</li>
            <li><strong>Overhead Press:</strong> 6-8 reps</li>
            <li><strong>Bent-Over Rows:</strong> 6-8 reps</li>
            <li><strong>Goblet Squats:</strong> 10-12 reps</li>
          </ul>
        </li>
        <li><strong>Cool Down (5-10 min)</strong>: Full-body stretching</li>
      </ul>
    </div>
  `;
}

export async function POST(req: Request) {
  const { chat } = await req.json();

  const intention: Intention = await determineIntention(chat);

  if (chat.messages[chat.messages.length - 1].content.toLowerCase().includes("workout")) {
    return new Response(await generateWorkoutResponse(), {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (intention.type === "question") {
    return ResponseModule.respondToQuestion(chat, providers, pineconeIndex);
  } else if (intention.type === "hostile_message") {
    return ResponseModule.respondToHostileMessage(chat, providers);
  } else {
    return ResponseModule.respondToRandomMessage(chat, providers);
  }
}

