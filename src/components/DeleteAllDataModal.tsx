import { Button, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { db } from "../db";

export function DeleteAllDataModal({ onOpen }: { onOpen: () => void }) {
  const [opened, { open, close }] = useDisclosure(false, { onOpen });

  return (
    <>
      <Button
        onClick={open}
        variant="outline"
        color="red"
        leftIcon={<IconTrash size={20} />}
      >
        {/* Delete All Data */}
        删除所有数据
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        // title="Delete All Data"
        title="删除所有数据"
        size="md"
        withinPortal
      >
        <Stack>
          {/* <Text size="sm">Are you sure you want to delete your data?</Text> */}
          <Text size="sm">请您确认是否要删除所有数据?</Text>
          <Button
            onClick={async () => {
              await db.delete();
              localStorage.clear();
              window.location.assign("/");
            }}
            color="red"
          >
            {/* Delete */}
            删除
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
