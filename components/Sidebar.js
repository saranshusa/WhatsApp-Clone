import styled from "styled-components";
import { Avatar, Button, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

function Sidebar() {
  const [user] = useAuthState(auth);
  const [newChatVisibility, setNewChatVisibility] = useState("none");
  const [input, setInput] = useState("");

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);

  const [chatsSnapshot] = useCollection(userChatRef);

  const openCreateChat = () => {
    setNewChatVisibility("block");
  };

  const createChat = (e) => {
    e.preventDefault();

    if (input !== "") {
      if (
        EmailValidator.validate(input) &&
        !chatAlreadyExists(input) &&
        input !== user.email
      ) {
        db.collection("chats").add({
          users: [user.email, input],
        });
      }

      setInput("");
      setNewChatVisibility("none");
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconsContainer>
          <IconButton>
            <ChatIcon onClick={openCreateChat} />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>

      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}

      <NewChat style={{ display: `${newChatVisibility}` }}>
        <NewChatForm>
          <h3>Start new chat</h3>
          <InputContainer>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type recipient's email"
            />
            <IconButton
              type="submit"
              style={{
                position: "absolute",
                right: "5px",
              }}
            >
              <SendIcon onClick={createChat} />
            </IconButton>
          </InputContainer>
        </NewChatForm>
      </NewChat>
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid #323739;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  background-color: #131c21;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  justify-content: space-between;
  background-color: #2a2f32;
  top: 0;
  z-index: 1;
  align-items: center;
  padding: 15px;
  height: 80px;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
  background-color: #323739;
  border-bottom: 1px solid #2a2f32;
`;

const SearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
  background-color: transparent;
  margin-left: 10px;
  color: #f1f1f2;
`;

const NewChat = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: saturate(180%) blur(10px);
  width: 100vw;
  height: 100vh;
  z-index: 101;
  position: fixed;
  top: 0;
  left: 0;
  color: black;
`;

const NewChatForm = styled.form`
  width: 40vw;
  height: 50vh;
  margin: auto;
  margin-top: 50vh;
  text-align: center;
  transform: translateY(-50%);
  background-color: #323739;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  justify-content: center;

  > h3 {
    font-weight: 500;
    font-size: 1.5rem;
    margin-bottom: 5vh;
  }
`;

const InputContainer = styled.div`
  display: flex;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  position: relative;

  * {
    color: black !important;
    align-self: center;
  }
`;

const Input = styled.input`
  color: black;
  border: none;
  width: 100%;
  border-radius: 25px;
  padding: 15px 25px;
  font-size: 1rem;
  outline: none;
  margin: auto;
`;
