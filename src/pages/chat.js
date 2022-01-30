import {
  Box,
  Text,
  TextField,
  Image,
  Button,
  Icon,
} from "@skynexui/components";
import { useState, useCallback } from "react";
import appConfig from "../../config.json";
import uniqueId from "lodash/uniqueId";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  function addNewMessage() {
    if (message.trim()) {
      setMessages((messagesOld) => [
        { id: uniqueId("aluracord"), text: message.trim(), from: "Iury" },
        ...messagesOld,
      ]);
    }

    setMessage("");
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addNewMessage();
    }
  }

  const removeMessage = useCallback((messageId) => {
    setMessages((messagesOld) =>
      messagesOld.filter((message) => message.id !== messageId)
    );
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
          maxWidth: "70%",
          maxHeight: "70vh",
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
                backgroundColor: appConfig.theme.colors.neutrals[800],
                color: appConfig.theme.colors.neutrals[200],
                fontSize: "1rem",
              }}
            />

            <Button
              onClick={addNewMessage}
              variant="primary"
              colorVariant="neutral"
              iconName="FaPaperPlane"
              size="md"
              disabled={message?.trim()?.length === 0}
              rounded="sm"
              type="button"
              styleSheet={{
                fontSize: "1.25rem",
                marginLeft: "1rem",
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
        overflow: "hidden",
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
                  src={`https://github.com/iury-sousa.png`}
                />

                <Text
                  tag="strong"
                  styleSheet={{
                    fontSize: ".925rem",
                    color: appConfig.theme.colors.primary[400],
                    fontWeight: "bold",
                    margin: "auto 0",
                  }}
                >
                  {message.from}
                </Text>
              </Box>

              <Icon
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
              />
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
                  color: appConfig.theme.colors.neutrals[200],
                  fontSize: "1rem",
                }}
              >
                {message.text}
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
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
          </Text>
        );
      })}
    </Box>
  );
}
