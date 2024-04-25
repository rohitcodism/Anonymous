import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// Create an OpenAI  API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
            const { prompt } = await req.json();
        
            // Ask OpenAI for a streaming chat completion given the prompt
            const response = await openai.completions.create({
                model: 'gpt-3.5-turbo-instruct',
                max_tokens: 400,
                stream: true,
                prompt,
            });
        
            // Convert the response into a friendly text-stream
            const stream = OpenAIStream(response);
            // Respond with the stream
            return new StreamingTextResponse(stream);
    } catch (error) {
        console.log("Internal Server Error: ", error);
        if(error instanceof OpenAI.APIError){
            const {name, status, headers, message} = error;
            return NextResponse.json(
                {
                    name: name,
                    status: status,
                    headers: headers,
                    message: message
                },
                {
                    status: 500
                }
            )
        }else{
            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error"
                },
                {
                    status: 500
                }
            )
        }
    }
}