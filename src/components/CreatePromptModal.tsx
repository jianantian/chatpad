import {
  ActionIcon,
  Button,
  Modal,
  Stack,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlaylistAdd, IconPlus } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { db } from "../db";

export function CreatePromptModal({ content }: { content?: string }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  useEffect(() => {
    setValue(content ?? "");
  }, [content]);

  return (
    <>
      {content ? (
        // <Tooltip label="Save Prompt" position="left">
        <Tooltip label="保存提示词" position="left">
          <ActionIcon onClick={open}>
            <IconPlaylistAdd opacity={0.5} size={20} />
          </ActionIcon>
        </Tooltip>
      ) : (
        <Button fullWidth onClick={open} leftIcon={<IconPlus size={20} />}>
          {/* New Prompt */}
          新提示词
        </Button>
      )}
      {/* <Modal opened={opened} onClose={close} title="Create Prompt" size="lg"> */}
      <Modal opened={opened} onClose={close} title="创建提示词" size="lg">
        <form
          onSubmit={async (event) => {
            try {
              setSubmitting(true);
              event.preventDefault();
              const id = nanoid();
              db.prompts.add({
                id,
                title,
                content: value,
                createdAt: new Date(),
              });
              notifications.show({
                // title: "Saved",
                // message: "Prompt created",
                title: "已保存",
                message: "提示词已创建",
              });
              close();
            } catch (error: any) {
                if (error.toJSON().message === "Network Error") {
                notifications.show({
                  //   title: "Error",
                  title: "错误",
                  color: "red",
                  //   message: "No internet connection.",
                  message: "无网络",
                });
              }
              const message = error.response?.data?.error?.message;
              if (message) {
                notifications.show({
                  //   title: "Error",
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
          <Stack>
            <TextInput
            //   label="Title"
            label="标题"
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
              formNoValidate
              data-autofocus
            />
            <Textarea
            //   placeholder="Content"
            placeholder="内容"
              autosize
              minRows={5}
              maxRows={10}
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
            <Button type="submit" loading={submitting}>
              {/* Save */}
              保存
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
