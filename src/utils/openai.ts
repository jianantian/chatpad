import { encode } from "gpt-token-utils";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { OpenAIExt } from "openai-ext";
import { db } from "../db";
import { defaultModel } from "./constants";
import { server, port, config } from "./config";
const decoder = new TextDecoder("utf-8");

function getClient(
  apiKey: string,
  apiType: string,
  apiAuth: string,
  basePath: string
) {
  const configuration = new Configuration({
    ...((apiType === "openai" ||
      (apiType === "custom" && apiAuth === "bearer-token")) && {
      apiKey: apiKey,
    }),
    ...(apiType === "custom" && { basePath: basePath }),
  });
  return new OpenAIApi(configuration);
}

export async function createStreamChatCompletion(
  apiKey: string,
  messages: ChatCompletionRequestMessage[],
  chatId: string,
  messageId: string
) {
  const settings = await db.settings.get("general");
  const model = settings?.openAiModel ?? config.defaultModel;

  return OpenAIExt.streamClientChatCompletion(
    {
      model,
      messages,
    },
    {
      apiKey: apiKey,
      handler: {
        onContent(content, isFinal, stream) {
          setStreamContent(messageId, content, isFinal);
          if (isFinal) {
            setTotalTokens(chatId, content);
          }
        },
        onDone(stream) {},
        onError(error, stream) {
          console.error(error);
        },
      },
    }
  );
}

function setStreamContent(
  messageId: string,
  content: string,
  isFinal: boolean
) {
  content = isFinal ? content : content + "█";
  db.messages.update(messageId, { content: content });
}

function setTotalTokens(chatId: string, content: string) {
  let total_tokens = encode(content).length;
  db.chats.where({ id: chatId }).modify((chat) => {
    if (chat.totalTokens) {
      chat.totalTokens += total_tokens;
    } else {
      chat.totalTokens = total_tokens;
    }
  });
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


export async function checkOpenAIKey(apiKey: string) {
  return true;
}
