import { Button, Card, Flex, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDatabaseExport, IconDatabaseImport } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import download from "downloadjs";
import { cloneElement, ReactElement } from "react";
import { db } from "../db";
import { DeleteAllDataModal } from "./DeleteAllDataModal";
import { DeleteChatsModal } from "./DeleteChatsModal";

export function DatabaseModal({ children }: { children: ReactElement }) {
  const [opened, { open, close }] = useDisclosure(false);
  const chatsCount = useLiveQuery(async () => {
    return (await db.chats.toArray()).length;
  }, []);
  const messagesCount = useLiveQuery(async () => {
    return (await db.messages.toArray()).length;
  }, []);
  const promptsCount = useLiveQuery(async () => {
    return (await db.prompts.toArray()).length;
  });

  return (
    <>
      {cloneElement(children, { onClick: open })}
      <Modal
        opened={opened}
        onClose={close}
        // title="Database"
        title="数据库"
        size="lg"
        withinPortal
        keepMounted
      >
        <Stack>
          <Flex>
            <Card withBorder sx={{ flex: 1 }}>
              <Text size="xl" align="center">
                {chatsCount}
              </Text>
              <Text
                size="xs"
                color="dimmed"
                align="center"
                tt="uppercase"
                fw={700}
              >
                {/* Chats */}
                对话
              </Text>
            </Card>
            <Card withBorder sx={{ flex: 1, marginLeft: -1 }}>
              <Text size="xl" align="center">
                {messagesCount}
              </Text>
              <Text
                size="xs"
                color="dimmed"
                align="center"
                tt="uppercase"
                fw={700}
              >
                {/* Messages */}
                消息
              </Text>
            </Card>
            <Card withBorder sx={{ flex: 1, marginLeft: -1 }}>
              <Text size="xl" align="center">
                {promptsCount}
              </Text>
              <Text
                size="xs"
                color="dimmed"
                align="center"
                tt="uppercase"
                fw={700}
              >
                {/* Prompts */}
                提示词
              </Text>
            </Card>
          </Flex>
          <Group>
            <Button
              variant="default"
              leftIcon={<IconDatabaseExport size={20} />}
              onClick={async () => {
                const blob = await db.export();
                download(
                  blob,
                  `multivac-export-${new Date().toLocaleString()}.json`,
                  "application/json"
                );
                notifications.show({
                //   title: "Exporting Data",
                //   message: "Your data is being exported.",
                title: "导出数据",
                message: "你的数据正在导出.",
                });
              }}
            >
              {/* Export Data */}
              导出数据
            </Button>
            <input
              id="file-upload-btn"
              type="file"
              onChange={async (e) => {
                const file = e.currentTarget.files?.[0];
                if (!file) return;
                db.import(file, {
                  acceptNameDiff: true,
                  overwriteValues: true,
                  acceptMissingTables: true,
                  clearTablesBeforeImport: true,
                })
                  .then(() => {
                    notifications.show({
                    //   title: "Importing data",
                    //   message: "Your data is being imported.",
                    title: "导入数据",
                      message: "你的数据正在导入.",
                    });
                  })
                  .catch((error) => {
                    notifications.show({
                    //   title: "Error",
                    //   color: "red",
                    //   message: "The file you selected is invalid",
                    title: "错误",
                      color: "red",
                      message: "你选择的文件读取失败.",
                    });
                  });
              }}
              accept="application/json"
              hidden
            />
            <Button
              component="label"
              htmlFor="file-upload-btn"
              variant="default"
              leftIcon={<IconDatabaseImport size={20} />}
            >
              {/* Import Data */}
              导入数据
            </Button>
          </Group>
          <Group>
            <DeleteChatsModal onOpen={close} />
            <DeleteAllDataModal onOpen={close} />
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
