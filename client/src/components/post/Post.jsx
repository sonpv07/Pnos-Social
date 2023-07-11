import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/comments";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Overlay from "../overlay/Overlay";

import {
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Alert,
} from "@mui/material";
import EditPost from "../edit-post/EditPost";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenOverlay, setIsOpenOverlay] = useState(false);
  const { user } = useContext(AuthContext);

  const menu = useRef(null);

  const closeOpenMenus = (e) => {
    if (menu.current && isOptionOpen && !menu.current.contains(e.target)) {
      setIsOptionOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);
  }, [closeOpenMenus]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/likes?postID=" + post.id).then((res) => {
        return res.data;
      }),
  });

  const {
    isLoading: commentLoading,
    error: commentError,
    data: commentData,
  } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () =>
      makeRequest.get("/comments?postID=" + post.id).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postID=" + post.id);
      return makeRequest.post("/likes", { postID: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const deleteMutation = useMutation(
    (postID) => {
      return makeRequest.delete("/posts/" + postID);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(user.id));
  };

  const handleDelete = () => {
    console.log("click");
    deleteMutation.mutate(post.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="post">
      <Overlay
        isOpen={isOpenOverlay}
        onClose={() => {
          setIsOpenOverlay(false);
          setIsOpenEdit(false);
        }}
      />
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={`/upload/${post.avatar}`} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userID}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createTime).fromNow()}</span>
            </div>
          </div>
          <span className="option" onClick={() => setIsOptionOpen(true)}>
            <MoreHorizIcon />
          </span>
          {isOptionOpen && post.userID === user.id && (
            <ul ref={menu} className="options">
              <li
                onClick={() => {
                  setIsOpenEdit(true);
                  setIsOpenOverlay(true);
                  // setLoading(true);
                }}
              >
                Edit Post
              </li>
              <li onClick={handleDelete}>Remove Post</li>
            </ul>
          )}

          {isOptionOpen && post.userID !== user.id && (
            <ul ref={menu} className="options">
              <li>Report Post</li>{" "}
            </ul>
          )}
        </div>
        <div className="content">
          <p>{post.content}</p>
          <img src={"/upload/" + post.image} alt="" />
        </div>
        <div className="info">
          <div className="item">
            <span>{data?.length}</span>

            {isLoading ? (
              "loading"
            ) : data?.includes(user.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <span>{commentData?.length}</span>
            <TextsmsOutlinedIcon />
          </div>
          <div className="item">
            <span>Share</span>
            <ShareOutlinedIcon />
          </div>
        </div>
        {commentOpen && <Comments postID={post.id} />}
      </div>

      {isOpenEdit ? (
        <EditPost
          post={post}
          setIsOpenEdit={setIsOpenEdit}
          setIsOpenOverlay={setIsOpenOverlay}
        />
      ) : (
        ""
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Congraturation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Alert severity="success">
              <AlertTitle>Delete post successful!</AlertTitle>
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Post;
