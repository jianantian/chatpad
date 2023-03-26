import { Button, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@tanstack/react-location";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { Chat, db } from "../db";
import { useApiKey } from "../hooks/useApiKey";
import { useChatId } from "../hooks/useChatId";

export function DeleteChatModal({
  chat,
  children,
}: {
  chat: Chat;
  children: ReactElement;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);

  const [key, setKey] = useApiKey();

  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(key);
  }, [key]);
  const chatId = useChatId();
  const navigate = useNavigate();

  return (
    <>
      {cloneElement(children, { onClick: open })}
      {/* <Modal opened={opened} onClose={close} title="Delete Chat"> */}
      <Modal opened={opened} onClose={close} title="删除对话">
        <form
          onSubmit={async (event) => {
            try {
              setSubmitting(true);
              event.preventDefault();
              await db.chats.where({ id: chat.id }).delete();
              await db.messages.where({ chatId: chat.id }).delete();
              if (chatId === chat.id) {
                navigate({ to: `/` });
              }
              close();

              notifications.show({
                // title: "Deleted",
                // message: "Chat deleted.",
                title: "已删除",
                message: "对话已删除.",
              });
            } catch (error: any) {
              if (error.toJSON().message === "Network Error") {
                // notifications.show({
                //   title: "Error",
                //   color: "red",
                //   message: "No internet connection.",
                // });
                notifications.show({
                    title: "错误",
                    color: "red",
                    message: "无网络.",
                  });
              } else {
                // notifications.show({
                //   title: "Error",
                //   color: "red",
                //   message:
                //     "Can't remove chat. Please refresh the page and try again.",
                // });
                notifications.show({
                    title: "错误",
                    color: "red",
                    message:
                      "无法删除对话. 请刷新页面后重试.",
                  });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Stack>
            {/* <Text size="sm">Are you sure you want to delete this chat?</Text> */}
            <Text size="sm">您是否要删除此对话?</Text>
            <Button type="submit" color="red" loading={submitting}>
              {/* Delete */}
              删除
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
