import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import { useState, useCallback, useMemo } from "react";
import appConfig from "../../config.json";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";

function Title(props) {
  const Tag = props.tag ?? "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>
        {`
          ${Tag} {
            color: ${appConfig.theme.colors.neutrals["000"]};
            font-size: 1.75rem;
          }
        `}
      </style>
    </>
  );
}

export default function HomePage() {
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const router = useRouter();

  const userSearch = useMemo(
    () =>
      debounce(async (username) => {
        if (username && username?.length > 2) {
          const response = await fetch(
            `https://api.github.com/users/${username}`
          );
          const userData = await response.json();

          if (userData?.login) {
            setUser(userData);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }, 750),
    []
  );

  const handleChange = useCallback(
    (e) => {
      const username = e.target.value;
      setUsername(username);
      userSearch(username);
    },
    [userSearch]
  );

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.neutrals[500],
          backgroundImage: `url(./static/background.gif)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[950],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={(event) => {
              event.preventDefault();
              router.push("/chat");
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginTop: "32px",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">¡Bienvenido de nuevo!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>
            <TextField
              onChange={handleChange}
              value={username}
              fullWidth
              size="md"
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[400],
                  backgroundColor: appConfig.theme.colors.neutrals[500],
                },
              }}
            />
            <Button
              type="submit"
              label="Iniciar sesión"
              fullWidth
              size="md"
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              border: "1px solid",
              borderColor: appConfig.theme.colors.primary[600],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            {user ? (
              <Image
                styleSheet={{
                  borderRadius: "50%",
                  marginBottom: "16px",
                }}
                src={user.avatar_url}
              />
            ) : (
              <Image
                styleSheet={{
                  borderRadius: "50%",
                  margin: "auto",
                }}
                src="static/user.png"
              />
            )}

            {user && (
              <Text
                variant="body4"
                styleSheet={{
                  color: appConfig.theme.colors.neutrals[200],
                  backgroundColor: appConfig.theme.colors.neutrals[500],
                  padding: "3px 10px",
                  borderRadius: "1000px",
                }}
              >
                {user.name}
              </Text>
            )}
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
