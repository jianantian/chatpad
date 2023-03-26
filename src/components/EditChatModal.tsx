import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { Chat, db } from "../db";

export function EditChatModal({
  chat,
  children,
}: {
  chat: Chat;
  children: ReactElement;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);

  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(chat?.description ?? "");
  }, [chat]);

  return (
    <>
      {cloneElement(children, { onClick: open })}
      {/* <Modal opened={opened} onClose={close} title="Edit Chat" withinPortal> */}
      <Modal opened={opened} onClose={close} title="修改对话" withinPortal>
        <form
          onSubmit={async (event) => {
            try {
              setSubmitting(true);
              event.preventDefault();
              await db.chats.where({ id: chat.id }).modify((chat) => {
                chat.description = value;
              });
              notifications.show({
                // title: "Saved",
                title: "已保存",
                message: "",
              });
              close();
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
              }
              const message = error.response?.data?.error?.message;
              if (message) {
                notifications.show({
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
              //   label="Name"
              label="名称"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              formNoValidate
              data-autofocus
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
