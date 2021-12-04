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

function Sidebar() {
  const [user] = useAuthState(auth);
  const [newChatVisibility, setNewChatVisibility] = useState("none");

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);

  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt("Enter email");

    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
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
            <ChatIcon onClick={createChat} />
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

      <NewChat style={{ display: { newChatVisibility } }} />
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
  background-color: red;
  width: 100vw;
  height: 100vh;
  z-index: 101;
  position: fixed;
  top: 0;
  left: 0;
`;
