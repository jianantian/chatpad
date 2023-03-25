import {
  Badge,
  Button,
  Center,
  Container,
  Group,
  SimpleGrid,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCloudDownload,
  IconCurrencyDollar,
  IconKey,
  IconLock,
  IconNorthStar,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { Logo } from "../components/Logo";
import { SettingsModal } from "../components/SettingsModal";
import { db } from "../db";

export function IndexRoute() {
  const settings = useLiveQuery(() => db.settings.get("general"));
  const { openAiApiKey } = settings ?? {};

  return (
    <>
      <Center py="xl" sx={{ height: "100%" }}>
        <Container size="sm">
          <Badge mb="lg">我认出风暴而激动如大海</Badge>
          <Text>
            <Logo style={{ maxWidth: 240 }} />
          </Text>
          <Text mt={4} size="xl">
            Just another ChatGPT user-interface!
          </Text>
          <SimpleGrid
            mt={50}
            cols={3}
            spacing={30}
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
          >
            {features.map((feature) => (
              <div key={feature.title}>
                <ThemeIcon variant="outline" size={50} radius={50}>
                  <feature.icon size={26} stroke={1.5} />
                </ThemeIcon>
                <Text mt="sm" mb={7}>
                  {feature.title}
                </Text>
                <Text size="sm" color="dimmed" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Text>
              </div>
            ))}
          </SimpleGrid>
          <Group mt={50}>
            <SettingsModal>
              <Button
                size="md"
                variant={openAiApiKey ? "light" : "filled"}
                leftIcon={<IconKey size={20} />}
              >
                {openAiApiKey ? "修改 OpenAI Key" : "请输入你的 OpenAI Key"}
              </Button>
            </SettingsModal>
            {/* {!window.todesktop && (
              <Button
                component="a"
                href="https://dl.todesktop.com/230313oyppkw40a"
                // href="https://download.chatpad.ai/"
                size="md"
                variant="outline"
                leftIcon={<IconCloudDownload size={20} />}
              >
                Download Desktop App
              </Button>
            )} */}
          </Group>
        </Container>
      </Center>
    </>
  );
}

const features = [
  {
    icon: IconCurrencyDollar,
    // title: "Free and open source",
    // description:
    //   "This app is provided for free and the source code is available on GitHub.",
    title: "免费并开源",
    description: "这个应用程序完全免费提供的, 源代码可在GitHub上找到."
  },
  {
    icon: IconLock,
    // title: "Privacy focused",
    // description:
    //   "No tracking, no cookies, no bullshit. All your data is stored locally.",
    title: "注重隐私",
    description:
      "不跟踪, 不使用 Cookie, 没有广告, 也不需要你为我买一杯啤酒, 你的所有数据都保存在本地.",
  },
  {
    icon: IconNorthStar,
    // title: "Best experience",
    // description:
    //   "Crafted with love and care to provide the best experience possible.",
    title: "最佳的体验",
    description:
      "精心设计，以提供最佳的使用体验.",
  },
];
