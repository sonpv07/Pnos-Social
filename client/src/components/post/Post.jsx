import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useNavigate } from "react-router-dom";
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
import Relationships from "../relationship/Relationships";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const [isOpenRelationships, setIsOpenRelationships] = useState(false);

  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [isOpenOverlay, setIsOpenOverlay] = useState(false);

  const [currentImg, setCurrentImg] = useState(0);

  const [followList, setFollowList] = useState("");

  const { user } = useContext(AuthContext);

  const gender = post.gender === "Male" ? "his" : "her";

  const menu = useRef(null);

  const nav = useNavigate();

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

  const { data: lData } = useQuery({
    queryKey: ["likeInfo", post.id],
    queryFn: () =>
      makeRequest.get("/likes/likeInfo?postID=" + post.id).then((res) => {
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
        queryClient.invalidateQueries();
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
        queryClient.invalidateQueries();
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(user.id));
  };

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleImage = (direction) => {
    let index = currentImg;

    if (direction === "left") {
      setCurrentImg(index - 1);
    }

    if (direction === "right") {
      setCurrentImg(index + 1);
    }
  };

  const {
    isLoading: iLoadng,
    error: iError,
    data: iData,
  } = useQuery({
    queryKey: ["postImages", post.id],
    queryFn: () =>
      makeRequest.get("/posts/postImages?postID=" + post.id).then((res) => {
        return res.data;
      }),
  });

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
                <span className="post-type">
                  {post.postTypeID === 2
                    ? ` updated ${gender} avatar`
                    : post.postTypeID === 3
                    ? ` updated ${gender} cover image`
                    : null}
                </span>
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
                  setIsOptionOpen(false);
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
          {iData?.length > 0 ? (
            <div className="image-container">
              <button
                style={
                  currentImg === 0 ? { display: "none" } : { display: "flex" }
                }
                onClick={() => handleImage("left")}
                className="left"
              >
                {" "}
                <i className="fa-solid fa-angle-left"></i>
              </button>

              <img
                src={"/upload/" + iData[currentImg]?.url}
                alt=""
                onClick={() => nav(`/post/${post.id}`)}
              />

              <button
                style={
                  currentImg === iData?.length - 1
                    ? { display: "none" }
                    : { display: "flex" }
                }
                onClick={() => handleImage("right")}
                className="right"
              >
                {" "}
                <i className="fa-solid fa-angle-right"></i>
              </button>
              <div className="dots">
                {iData.length > 1 &&
                  iData.map((data, index) => (
                    <i
                      style={
                        index === currentImg
                          ? { color: "#0095f6" }
                          : { color: "white" }
                      }
                      key={index}
                      className="fa-solid fa-circle"
                    ></i>
                  ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="info">
          <div className="item">
            <span
              onClick={() => {
                setIsOpenRelationships(true);
                setFollowList("likes");
              }}
            >
              {data?.length}
            </span>

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
        {commentOpen && <Comments postID={post.id} commentData={commentData} />}
      </div>

      {isOpenEdit ? (
        <EditPost
          post={post}
          postImages={iData}
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
        <DialogTitle id="alert-dialog-title">{"Warning!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Alert severity="warning">
              <AlertTitle>Are you sure want to delete this post</AlertTitle>
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleCloseDialog();
              deleteMutation.mutate(post.id);
            }}
          >
            Yes
          </Button>

          <Button
            autoFocus
            onClick={() => {
              handleCloseDialog();
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      {isOpenRelationships ? (
        <Relationships
          followList={followList}
          likes={lData}
          setIsOpenRelationships={setIsOpenRelationships}
          currentProfile={user.id}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Post;
