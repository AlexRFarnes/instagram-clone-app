import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import React from "react";
import { UserContext } from "../App";
import Layout from "../components/shared/Layout";
import LoadingScreen from "../components/shared/LoadingScreen";
import ProfilePicture from "../components/shared/ProfilePicture";
// import { defaultCurrentUser } from "../data";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import { useEditProfilePageStyles } from "../styles";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { EDIT_USER } from "../graphql/mutations";
import { AuthContext } from "../auth";

function EditProfilePage({ history }) {
  const { currentUserId } = React.useContext(UserContext);
  // console.log({ me, currentUserId });
  const variables = { id: currentUserId };
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, { variables });
  const classes = useEditProfilePageStyles();
  const [showDrawer, setDrawer] = React.useState(false);
  const path = history.location.pathname;

  if (loading) return <LoadingScreen />;

  function handleToggleDrawer() {
    setDrawer(prevState => !prevState);
  }

  function handleSelected(index) {
    switch (index) {
      case 0:
        return path.includes("edit");
      default:
        break;
    }
  }

  function handleListClick(index) {
    switch (index) {
      case 0:
        history.push("/accounts/edit");
        break;
      default:
        break;
    }
  }

  const options = [
    "Edit Profile",
    "Change Password",
    "Apps and Websites",
    "Emails and SMS",
    "Push Notifications",
    "Manage Contacts",
    "Privacy and Security",
    "Login Activity",
    "Emails from Instagram",
  ];

  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
          classes={{
            selected: classes.listItemSelected,
            button: classes.listItemButton,
          }}>
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Layout title='Edit Profile'>
      <section className={classes.section}>
        <IconButton
          edge='start'
          onClick={handleToggleDrawer}
          className={classes.menuButton}>
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation='css'>
            <Drawer
              variant='temporary'
              anchor='left'
              open={showDrawer}
              onClose={handleToggleDrawer}
              classes={{ paperAnchorLeft: classes.temporaryDrawer }}>
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden
            xsDown
            implementation='css'
            className={classes.permanentDrawerRoot}>
            <Drawer
              variant='permanent'
              open
              classes={{
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot,
              }}>
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {path.includes("edit") && <EditUserInfo user={data.users_by_pk} />}
        </main>
      </section>
    </Layout>
  );
}

const DEFAULT_ERROR = { type: "", message: "" };

function EditUserInfo({ user }) {
  const classes = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm();
  const [editUser] = useMutation(EDIT_USER);
  const { updateEmail } = React.useContext(AuthContext);
  const [error, setError] = React.useState(DEFAULT_ERROR);
  const [open, setOpen] = React.useState(false);

  async function onSubmit(data) {
    try {
      setError(DEFAULT_ERROR);
      const variables = { ...data, id: user.id };
      await updateEmail(data.email);
      await editUser({ variables });
      setOpen(true);
    } catch (error) {
      console.error("Error updating profile", error);
      handleError(error);
    }
  }

  function handleError(error) {
    if (error.message.includes("users_username_key")) {
      setError({ type: "username", message: "This username is already taken" });
    } else if (error.code.includes("auth")) {
      setError({ type: "email", message: error.message });
    }
  }

  return (
    <FormProvider register={register}>
      <section className={classes.container}>
        <div className={classes.pictureSectionItem}>
          <ProfilePicture size={38} image={user.profile_image} />
          <div className={classes.justifySelfStart}>
            <Typography className={classes.typography}>
              {user.username}
            </Typography>
            <Typography
              color='primary'
              variant='body2'
              className={classes.typographyChangePic}>
              Change Profile Photo
            </Typography>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <SectionItem
            name='name'
            rules={{ required: true, minLength: 5, maxLength: 20 }}
            text='Name'
            formItem={user.name}
          />
          <SectionItem
            name='username'
            rules={{
              required: true,
              pattern: /^[a-zA-Z0-9._]*$/,
              minLength: 5,
              maxLength: 20,
            }}
            error={error}
            text='Username'
            formItem={user.username}
          />
          <SectionItem
            name='website'
            rules={{
              validate: input =>
                Boolean(input)
                  ? isURL(input, {
                      protocols: ["http", "https"],
                      require_protocol: true,
                    })
                  : true,
            }}
            text='Website'
            formItem={user.website}
          />
          <div className={classes.sectionItem}>
            <aside>
              <Typography className={classes.bio}>Bio</Typography>
            </aside>
            <TextField
              {...register("bio", { maxLength: 120 })}
              variant='outlined'
              multiline
              maxRows={3}
              minRows={3}
              fullWidth
              defaultValue={user.bio}
            />
          </div>
          <div className={classes.sectionItem}>
            <div />
            <Typography
              color='textSecondary'
              className={classes.justifySelfStart}>
              Personal Information
            </Typography>
          </div>
          <SectionItem
            name='email'
            rules={{
              required: true,
              validate: input => isEmail(input),
            }}
            text='Email'
            type='email'
            formItem={user.email}
            error={error}
          />
          <SectionItem
            name='phoneNumber'
            rules={{
              validate: input => (Boolean(input) ? isMobilePhone(input) : true),
            }}
            text='Phone'
            formItem={user.phone_number}
          />
          <div className={classes.sectionItem}>
            <div />
            <Button
              type='submit'
              color='primary'
              variant='contained'
              className={classes.justifySelfStart}>
              Submit
            </Button>
          </div>
        </form>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          TransitionComponent={Slide}
          message={<span>Profile updated</span>}
          onClose={() => setOpen(false)}
        />
      </section>
    </FormProvider>
  );
}

function SectionItem({ type = "text", text, formItem, name, rules, error }) {
  const { register } = useFormContext();
  const classes = useEditProfilePageStyles();

  return (
    <div className={classes.sectionItemWrapper}>
      <aside>
        <Hidden xsDown>
          <Typography align='right' className={classes.typography}>
            {text}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography className={classes.typography}>{text}</Typography>
        </Hidden>
      </aside>
      <TextField
        // name={name}
        {...register(name, { ...rules })}
        // {...register("test", { required: true, minLength: 5 })}
        fullWidth
        helperText={error?.type === name && error.message}
        variant='outlined'
        defaultValue={formItem}
        type={type}
        className={classes.textField}
        inputProps={{
          className: classes.textFieldInput,
        }}
      />
    </div>
  );
}

export default EditProfilePage;
