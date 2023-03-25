import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { db } from "../db";
import { defaultModel } from "./constants";
import { server, port } from "./config";
const decoder = new TextDecoder("utf-8");

function getClient(apiKey: string) {
  const configuration = new Configuration({
    apiKey,
  });
  return new OpenAIApi(configuration);
}

export async function createChatCompletionImpl(
  apiKey: string,
  messages: ChatCompletionRequestMessage[]
) {
  const settings = await db.settings.get("general");
  const model = settings?.openAiModel ?? defaultModel;

  const client = getClient(apiKey);
  return client.createChatCompletion({
    model,
    stream: false,
    messages,
  });
}

export async function checkOpenAIKeyImpl(apiKey: string) {
  return createChatCompletionImpl(apiKey, [
    {
      role: "user",
      content: "hello",
    },
  ]);
}

export async function createChatCompletion(
  apiKey: string,
  messages: ChatCompletionRequestMessage[]
) {
  const settings = await db.settings.get("general");
  const model = settings?.openAiModel ?? defaultModel;
  try {
    const body: string = JSON.stringify({
      model: model,
      messages: messages,
    });

    console.log(body);

    const url = `http://${server}:${port}/chat_batch`;
    const resp = await fetch(url, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const result = JSON.parse(await resp.json());
    return result;
  } catch (error) {
    throw error;
  }
}

// export async function createChatCompletion(
//   apiKey: string,
//   messages: ChatCompletionRequestMessage[]
// ) {
//   let result = {
//     data: {
//       choices: [{ message: { content: "" } }],
//       usage: { total_tokens: 0 },
//     },
//   };
//   const { body, status } = await createChatCompletionBase(apiKey, messages);
//   if (body) {
//     const reader = body.getReader();
//     result = await loadChatResponse(reader, status);
//   }
//   return result;
// }

// const loadChatResponse = async (
//   reader: ReadableStreamDefaultReader<Uint8Array>,
//   status: number
// ) => {
//   const regex = /({.*?]})/g;
//   const { done, value } = await reader.read();
//   const decodeText: string = decoder.decode(value);
//   decodeText.replace;
//   const result = JSON.parse(decodeText);
//   return result;
// };

// const readChatStream = async (
//   reader: ReadableStreamDefaultReader<Uint8Array>,
//   messageList: ChatCompletionRequestMessage[],
//   status: number
// ) => {
//   const regex = /({.*?]})/g;
//   const { done, value } = await reader.read();
//   if (done) {
//     reader.closed;
//     return;
//   }
//   const decodeText = decoder.decode(value);
//   const dataList = status === 200 ? decodeText.match(regex) : [decodeText];
//   dataList?.forEach((v: any) => {
//     const json = JSON.parse(v);
//     console.log(json);
//     let content =
//       status === 200 ? json.choices[0].delta.content : json.error.message;
//     content = content === undefined ? "" : content;
//     messageList[messageList.length - 1].content += content;
//   });
//   await readChatStream(reader, messageList, status);
// };

export async function checkOpenAIKey(apiKey: string) {
  return true;
}
