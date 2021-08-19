import React from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from "@material-ui/icons";
import handleImageUpload from "../../utils/handleImageUpload";
import { useMutation } from "@apollo/react-hooks";
import { EDIT_USER_AVATAR } from "../../graphql/mutations";
import { UserContext } from "../../App";

function ProfilePicture({ size, image, isOwner }) {
  const { currentUserId } = React.useContext(UserContext);
  const classes = useProfilePictureStyles({ size, isOwner });
  const inputRef = React.useRef();
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [profileImage, setProfileImage] = React.useState(image);

  function openFileInput() {
    inputRef.current.click();
  }

  async function handleUpdateProfilePic(event) {
    const url = await handleImageUpload(event.target.files[0]);
    const variables = { id: currentUserId, profileImage: url };
    await editUserAvatar({ variables });
    setProfileImage(url);
  }

  return (
    <section className={classes.section}>
      <input
        onChange={handleUpdateProfilePic}
        type='file'
        style={{ display: "none" }}
        ref={inputRef}
      />
      {image ? (
        <div
          className={classes.wrapper}
          onClick={isOwner ? openFileInput : null}>
          <img
            src={profileImage}
            alt='user profile'
            className={classes.image}
          />
        </div>
      ) : (
        <div className={classes.wrapper}>
          <Person className={classes.person} />
        </div>
      )}
    </section>
  );
}

export default ProfilePicture;
