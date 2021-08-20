import React from "react";
import { Typography } from "@material-ui/core";
import { getDefaultPost, defaultUser } from "../../data";
import { LoadingLargeIcon } from "../../icons";
import { useMorePostsFromUserStyles } from "../../styles";
import GridPost from "../shared/GridPost";
import { Link } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { GET_MORE_POSTS_FROM_USER, GET_POST } from "../../graphql/queries";

function MorePostsFromUser({ postId }) {
  const classes = useMorePostsFromUserStyles();
  const variables = {
    postId,
  };
  const { data, loading } = useQuery(GET_POST, { variables });
  const [getMorePostsFromUser, { data: morePosts, loading: loadingMorePosts }] =
    useLazyQuery(GET_MORE_POSTS_FROM_USER);
  // let loading = false;

  React.useEffect(() => {
    if (loading) return;
    const userId = data.posts_by_pk.user.id;
    const postId = data.posts_by_pk.id;
    const variables = {
      userId,
      postId,
    };
    getMorePostsFromUser({ variables });
  }, [data, loading, getMorePostsFromUser]);

  return (
    <div className={classes.container}>
      {loading || loadingMorePosts ? (
        <LoadingLargeIcon />
      ) : (
        <>
          <Typography
            color='textSecondary'
            variant='subtitle2'
            component='h2'
            gutterBottom
            className={classes.typography}>
            More Posts from{" "}
            <Link
              to={`/${data.posts_by_pk.user.username}`}
              className={classes.link}>
              @{data.posts_by_pk.user.username}
            </Link>
          </Typography>
          <article className={classes.article}>
            <div className={classes.postContainer}>
              {morePosts?.posts.map(post => (
                <GridPost key={post.id} post={post} />
              ))}
            </div>
          </article>
        </>
      )}
    </div>
  );
}

export default MorePostsFromUser;
