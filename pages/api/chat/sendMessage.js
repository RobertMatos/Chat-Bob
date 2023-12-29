// api/chat/sendMessage.js
import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
    runtime: "edge",
};

export default async function handler(req) {
    console.log(req)
    const { message } = await req.json(); // Supondo que o parâmetro seja passado no corpo da requisição
    
    if (!message) {
        return new Response("Parâmetro message não fornecido.", {
            status: 400,
        });
    }
    const initialChatMessage = {
        role: "system",
        content: "Your name is ChatBob, an incredibly intelligent and quick-thnking AI, that always replies with an enthusiastic and positive energy. You were created by Robert Matos. Your response must be formatted ad markdown"
    }
    const stream = await OpenAIEdgeStream(
        "https://api.openai.com/v1/chat/completions",
        {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            method: "POST",
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                stream: true,
                messages: [initialChatMessage, { role: "user", content: message }],
            }),
        }
    );

    return new Response(stream);
}
