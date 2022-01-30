import {
  Box,
  Text,
  TextField,
  Image,
  Button,
  Icon,
} from "@skynexui/components";
import { useState, useCallback, useEffect } from "react";
import appConfig from "../../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../components/ButtonSendSticker";

const SUPABASE_PUBLIC_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU1MjAwNywiZXhwIjoxOTU5MTI4MDA3fQ.4Vvu5Rh00WqSeM0THjKTxi4Mg1T4PeNk9KYhelN6Yps";

const SUPABASE_URL = "https://andshrzixucgwstlaxgz.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLIC_ANON_KEY);

function onRealTimeMessages(addNewMessage) {
  return supabaseClient
    .from("messages")
    .on("INSERT", (response) => addNewMessage(response.new))
    .subscribe();
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const user = router.query?.username;

  async function addNewMessage(newMessage) {
    if (newMessage.trim()) {
      const tempMessage = {
        text: newMessage.trim(),
        from: user,
      };

      await supabaseClient
        .from("messages")
        .insert([tempMessage])
        .then(({ data }) => console.log(data));
    }

    setMessage("");
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addNewMessage(message);
    }
  }

  const removeMessage = useCallback(async (messageId) => {
    await supabaseClient.from("messages").delete().match({ id: messageId });

    setMessages((messagesOld) =>
      messagesOld.filter((message) => message.id !== messageId)
    );
  }, []);

  useEffect(() => {
    supabaseClient
      .from("messages")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => setMessages(data));

    const subscription = onRealTimeMessages((message) =>
      setMessages((messagesOld) => [message, ...messagesOld])
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(./static/background.gif)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[950],
          height: "100%",
          maxWidth: { sm: "95%", md: "75%" },
          maxHeight: { sm: "95%", md: "75%" },
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList messages={messages} removeMessage={removeMessage} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje aquí"
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[950],
                color: appConfig.theme.colors.neutrals[200],
                fontSize: "1rem",
              }}
            />

            <Box
              styleSheet={{
                display: "flex",
                marginLeft: "1rem",
                gap: ".5rem",
              }}
            >
              <ButtonSendSticker
                onStickerClick={(sticker) => {
                  addNewMessage(`:sticker:${sticker}`);
                }}
              />

              <Button
                onClick={() => addNewMessage(message)}
                variant="primary"
                colorVariant="neutral"
                iconName="FaPaperPlane"
                size="md"
                disabled={message?.trim()?.length === 0 || !user}
                rounded="sm"
                type="button"
                styleSheet={{
                  fontSize: "1.25rem",
                  marginVertical: "auto",
                }}
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.primary[400],
                  mainColorLight: appConfig.theme.colors.primary[400],
                  mainColorStrong: appConfig.theme.colors.primary[600],
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          variant="heading4"
          styleSheet={{ color: appConfig.theme.colors.neutrals[200] }}
        >
          Chat
        </Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Cerrar sesión"
          size="md"
          buttonColors={{
            contrastColor: appConfig.theme.colors.neutrals["000"],
            mainColor: appConfig.theme.colors.primary[400],
            mainColorLight: appConfig.theme.colors.primary[400],
            mainColorStrong: appConfig.theme.colors.primary[600],
          }}
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {(props.messages || []).map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "12px 16px",
              marginBottom: "2px",
              maxWidth: "60%",
              width: "fit-content",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "spaceBetween",
              }}
            >
              <Box
                styleSheet={{
                  marginBottom: "8px",
                  display: "flex",
                  flexDirection: "row",
                  flex: "1",
                }}
              >
                <Image
                  styleSheet={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/${message.from}.png`}
                />

                <Text
                  as="a"
                  href={`https://github.com/${message.from}`}
                  target="_blank"
                  styleSheet={{
                    fontSize: ".925rem",
                    color: appConfig.theme.colors.primary[400],
                    fontWeight: "bold",
                    margin: "auto 0",
                    textDecoration: "none",
                    hover: {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {message.from}
                </Text>
              </Box>

              {/* <Icon
                onClick={() => props.removeMessage(message.id)}
                name="FaTimes"
                size="1rem"
                styleSheet={{
                  color: appConfig.theme.colors.primary[400],
                  marginLeft: ".5rem",
                  cursor: "pointer",
                  transition: "color .15s ease-out",
                  hover: { color: appConfig.theme.colors.primary[600] },
                }}
              /> */}
            </Box>

            <Box
              styleSheet={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "spaceBetween",
              }}
            >
              <Text
                tag="p"
                styleSheet={{
                  flex: "1",
                  overflowWrap: "anywhere",
                  color: appConfig.theme.colors.neutrals[200],
                  fontSize: "1rem",
                  lineHeight: "1.125rem",
                }}
              >
                {message?.text?.startsWith(":sticker:") ? (
                  <Image
                    src={message.text.replace(":sticker:", "")}
                    styleSheet={{ maxWidth: "128px", maxHeight: "128px" }}
                  />
                ) : (
                  message.text
                )}
              </Text>
              <Text
                styleSheet={{
                  fontSize: "11px",
                  marginLeft: ".5rem",
                  color: appConfig.theme.colors.neutrals[300],
                  alignSelf: "flex-end",
                }}
                tag="span"
              >
                {new Intl.DateTimeFormat("default", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour12: false,
                }).format(new Date(message.created_at))}
              </Text>
            </Box>
          </Text>
        );
      })}
    </Box>
  );
}
