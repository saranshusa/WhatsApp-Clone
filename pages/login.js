import styled from "styled-components";
import Head from "next/head";
import { Button } from "@mui/material";
import { auth, provider } from "../firebase";

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginConatiner>
        <Logo src="https://www.logo.wine/a/logo/WhatsApp/WhatsApp-Logo.wine.svg" />
        <GoogleButton onClick={signIn} variant="outlined">
          Sign in with Google
        </GoogleButton>
      </LoginConatiner>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: #090e11;
`;

const LoginConatiner = styled.div`
  display: flex;
  padding: 100px;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  flex-direction: column;
`;

const GoogleButton = styled(Button)`
  color: black;
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
