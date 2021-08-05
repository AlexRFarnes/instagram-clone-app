import { Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { useGridPostStyles } from "../../styles";

function GridPost({ post }) {
  const history = useHistory();
  const classes = useGridPostStyles();

  function handleOpenPostModal() {
    history.push({
      pathname: `/p/${post.id}`,
      state: {
        modal: true,
      },
    });
  }

  return (
    <div onClick={handleOpenPostModal} className={classes.gridPostContainer}>
      <div className={classes.gridPostOverlay}>
        <div className={classes.gridPostInfo}>
          <span className={classes.likes}></span>
          <Typography>{post.likes}</Typography>
        </div>
        <div className={classes.gridPostInfo}>
          <span className={classes.comments}></span>
          <Typography>{post.comments.length}</Typography>
        </div>
      </div>
      <img src={post.media} alt='Post cover' className={classes.image} />
    </div>
  );
}

export default GridPost;
