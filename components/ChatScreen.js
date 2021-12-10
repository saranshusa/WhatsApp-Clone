import { Avatar, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import { useRef, useState } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import firebase from "firebase/compat/app";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const endOfMessagesRef = useRef(null);

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      }
    );
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  console.log(getRecipientEmail(chat.users, user));

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last seen{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "not available"
              )}
            </p>
          ) : (
            ""
            // <p>...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <Input
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button hidden onClick={sendMessage} type="submit" disabled={!input}>
          Send
        </button>
        <IconButton>
          <MicIcon />
        </IconButton>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  background-color: #2a2f32;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  padding: 11px;
  display: flex;
  top: 0;
  height: 80px;
  align-items: center;
  background-color: #2a2f32;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
    font-size: 1rem;
    font-weight: 400;
  }

  > p {
    font-size: 14px;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #090e11;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: #1e2428;
  height: 9vh;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 100px;
  background-color: #33383b;
  padding: 10px 20px;
  margin-left: 20px;
  margin-right: 20px;
  font-family: "Open Sans";
  color: #f1f1f2;
  font-size: 1rem;
`;
