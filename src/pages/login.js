import React from "react";
import { useLoginPageStyles } from "../styles";
import SEO from "../components/shared/Seo";
import {
  Button,
  Card,
  CardHeader,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import FacebookIconBlue from "../images/facebook-icon-blue.svg";
import FacebookIconWhite from "../images/facebook-icon-white.png";
import { useForm } from "react-hook-form";
import { AuthContext } from "../auth";
import isEmail from "validator/lib/isEmail";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_USER_EMAIL } from "../graphql/queries";
import { AuthError } from "./signup";

function LoginPage() {
  const classes = useLoginPageStyles();
  const { register, handleSubmit, watch, formState } = useForm({
    mode: "onBlur",
  });
  const [showPassword, setPasswordVisibility] = React.useState(false);
  const { logInWithEmailAndPassword } = React.useContext(AuthContext);
  const hasPassword = Boolean(watch("password"));
  const history = useHistory();
  const client = useApolloClient();
  const [error, setError] = React.useState("");

  async function onSubmit({ input, password }) {
    try {
      setError("");
      // console.log(input, password);
      if (!isEmail(input)) {
        input = await getUserEmail(input);
      }
      await logInWithEmailAndPassword(input.trim(), password);
      setTimeout(() => history.push("/"), 2000);
    } catch (error) {
      // console.error("Error loggin in", error);
      handleError(error);
    }
  }

  function handleError(error) {
    if (error.code.includes("auth/wrong-password")) {
      setError(error.message);
    } else if (error.code.includes("auth/user-not-found")) {
      setError(
        "The username you entered doesn't belong to an account. Please check your username and try again."
      );
    }
  }

  async function getUserEmail(input) {
    const variables = { input };
    const response = await client.query({
      query: GET_USER_EMAIL,
      variables,
    });
    const userEmail = response.data.users[0]?.email || "no@email.com";
    return userEmail;
  }

  function togglePasswordVisibility() {
    setPasswordVisibility(prev => !prev);
  }

  return (
    <>
      <SEO title={"Login"} />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name='input'
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                fullWidth
                variant='filled'
                label='Username, email, or phone'
                margin='dense'
                className={classes.textField}
                autoComplete='username'
              />
              <TextField
                name='password'
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                InputProps={{
                  endAdornment: hasPassword && (
                    <InputAdornment position='end'>
                      <Button onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                variant='filled'
                type={showPassword ? "text" : "password"}
                label='Password'
                margin='dense'
                className={classes.textField}
                autoComplete='current-password'
              />
              <Button
                disabled={!formState.isValid || formState.isSubmitting}
                variant='contained'
                fullWidth
                color='primary'
                className={classes.button}
                type='submit'>
                Log In
              </Button>
            </form>
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant='body2' color='textSecondary'>
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <LogInWithFacebook color='secondary' iconColor='blue' />
            <AuthError error={error} />
            <Button fullWidth color='secondary'>
              <Typography variant='caption'>Forgot password?</Typography>
            </Button>
          </Card>
          <Card className={classes.signUpCard}>
            <Typography align='right' variant='body2'>
              Don't have an account?
            </Typography>
            <Link to='/accounts/emailsignup'>
              <Button color='primary' className={classes.signUpButton}>
                Sign up
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export function LogInWithFacebook({ color, iconColor, variant }) {
  const classes = useLoginPageStyles();
  const { logInWithFacebook } = React.useContext(AuthContext);
  const facebookIcon =
    iconColor === "blue" ? FacebookIconBlue : FacebookIconWhite;
  const [error, setError] = React.useState("");
  const history = useHistory();

  async function handleLoginWithFacebook() {
    try {
      await logInWithFacebook();
      setTimeout(() => history.push("/"), 2000);
    } catch (error) {
      console.error("Error loggin in with Facebook", error);
      setError(error.message);
    }
  }

  return (
    <>
      <Button
        onClick={handleLoginWithFacebook}
        fullWidth
        color={color}
        variant={variant}>
        <img
          src={facebookIcon}
          alt='facebook icon'
          className={classes.facebookIcon}
        />
        Log In With Facebook
      </Button>
      <AuthError error={error} />
    </>
  );
}

export default LoginPage;
