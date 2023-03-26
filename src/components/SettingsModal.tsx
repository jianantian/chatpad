import {
  Alert,
  Anchor,
  Button,
  Flex,
  List,
  Modal,
  PasswordInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useLiveQuery } from "dexie-react-hooks";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { db } from "../db";
import { availableModels, defaultModel } from "../utils/constants";
import { checkOpenAIKey } from "../utils/openai";

export function SettingsModal({ children }: { children: ReactElement }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);

  const [value, setValue] = useState("");
  const [model, setModel] = useState(defaultModel);

  const settings = useLiveQuery(async () => {
    return db.settings.where({ id: "general" }).first();
  });

  useEffect(() => {
    if (settings?.openAiApiKey) {
      setValue(settings.openAiApiKey);
    }
    if (settings?.openAiModel) {
      setModel(settings.openAiModel);
    }
  }, [settings]);

  return (
    <>
      {cloneElement(children, { onClick: open })}
      {/* <Modal opened={opened} onClose={close} title="Settings" size="lg"> */}
      <Modal opened={opened} onClose={close} title="设置" size="lg">
        <Stack>
          <form
            onSubmit={async (event) => {
              try {
                setSubmitting(true);
                event.preventDefault();
                await checkOpenAIKey(value);
                await db.settings.where({ id: "general" }).modify((apiKey) => {
                  apiKey.openAiApiKey = value;
                  console.log(apiKey);
                });
                notifications.show({
                  title: "已保存",
                  message: "你的 OpenAI Key 已经保存.",
                });
              } catch (error: any) {
                if (error.toJSON().message === "Network Error") {
                  notifications.show({
                    // title: "Error",
                    title: "错误",
                    color: "red",
                    message: "网络连接错误.",
                  });
                }
                const message = error.response?.data?.error?.message;
                if (message) {
                  notifications.show({
                    // title: "Error",
                    title: "错误",
                    color: "red",
                    message,
                  });
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <Flex gap="xs" align="end">
              <PasswordInput
                label="OpenAI API Key"
                placeholder="如果你没有可以输入任意字符，比如 help"
                sx={{ flex: 1 }}
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                formNoValidate
              />
              <Button type="submit" loading={submitting}>
                {/* Save */}
                保存
              </Button>
            </Flex>
          </form>
          <List withPadding>
            <List.Item>
              <Text size="sm">
                <Anchor
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                >
                  {/* Get your OpenAI API key */}
                  获取你的 OpenAI API Key
                </Anchor>
              </Text>
            </List.Item>
            <List.Item>
              <Text size="sm" color="dimmed">
                {/* The API Key is stored locally on your browser and never sent
                anywhere else. */}
                你的 API Key 存储在本地而不会上传到其它任何地方.
              </Text>
            </List.Item>
          </List>
          <Select
            // label="OpenAI Model"
            label="OpenAI 模型"
            value={model}
            onChange={(value) => {
              db.settings.update("general", {
                openAiModel: value ?? undefined,
              });
            }}
            withinPortal
            data={availableModels}
          />
          {/* <Alert color="orange" title="Warning"> */}
            {/* The displayed cost was not updated yet to reflect the costs for each
            model. Right now it will always show the cost for GPT-3.5. */}
          {/* </Alert> */}
        </Stack>
      </Modal>
    </>
  );
}
