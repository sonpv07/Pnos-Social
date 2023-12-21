import React, { useContext, useEffect, useReducer, useState } from "react";
import "./createpost.scss";
import { AuthContext } from "../../context/authContext";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Home from "../../pages/home/Home";
import {
  AlertTitle,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Alert,
} from "@mui/material";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { makeRequest } from "../../axios.js";

export default function CreatePost({ user }) {
  // const [checkUpdate, forceUpdate] = useReducer((x) => x + 1, 0);

  // const [disable, setDisable] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [content, setContent] = useState("");

  const [file, setFile] = useState(null);

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () =>
      makeRequest.get("/users/find/" + user.id).then((res) => {
        return res.data;
      }),
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["postsID"],
    queryFn: () =>
      makeRequest.get("/posts/allPost").then((res) => {
        return res.data;
      }),
  });

  const uploadMultiple = async () => {
    try {
      const formData = new FormData();
      for (const single_file of file) {
        formData.append("files", single_file);
      }
      const res = await makeRequest.post("/uploadMultiple", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const mutationActivites = useMutation({
    mutationFn: (activity) => {
      return makeRequest.post("/activities", activity);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await uploadMultiple();
    mutation.mutate({ content, image: imgUrl, postTypeID: 1 });
    mutationActivites.mutate({
      activityUserID: user.id,
      activityTypeID: 3,
      activityPostID: data[0]?.id + 1,
    });
    setFile(null);
    setOpenDialog(true);
    setContent("");
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      {user !== undefined ? (
        <div className="createPost">
          <div className="container">
            <div className="top">
              <Link to={`/profile/${user?.id}`}>
                <img
                  src={`/upload/${userData?.avatar}`}
                  alt=""
                  className="avatar"
                />
              </Link>
              <div className="input-place">
                <textarea
                  id="content"
                  name="content"
                  placeholder={`What's on your mind, ${user.firstName} ${user.lastName}`}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                />
              </div>
            </div>

            <hr />

            <div className="bottom">
              <div className="left">
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files)}
                  multiple="multiple"
                />
                <label htmlFor="file">
                  <div className="item">
                    <img src={Image} alt="" />
                    <span>Add images</span>
                  </div>
                </label>
                <div className="item">
                  <img src={Map} alt="" />
                  <span>Add places</span>
                </div>
                <div className="item">
                  <img src={Friend} alt="" />
                  <span>Tag friends</span>
                </div>
              </div>
              <div className="right">
                <button type="submit">Post</button>
              </div>
            </div>

            {file ? (
              <div className="bottom-2">
                {file.length > 4 ? (
                  <div className="img-container">
                    {Array.from(file)
                      .splice(0, 3)
                      .map((item, index) => (
                        <img
                          src={URL.createObjectURL(item)}
                          alt=""
                          key={index}
                        />
                      ))}{" "}
                    <div className="img-4" num-img={`+ ${file.length - 4}`}>
                      <img src={URL.createObjectURL(file[4])} alt="" />{" "}
                    </div>
                  </div>
                ) : file.length === 1 ? (
                  <div
                    className="img-container"
                    style={{ gridTemplateColumns: "repeat(1, 1fr)" }}
                  >
                    {Array.from(file).map((item, index) => (
                      <img
                        src={URL.createObjectURL(item)}
                        alt=""
                        key={index}
                        style={{ height: "100%" }}
                      />
                    ))}
                  </div>
                ) : file.length === 4 ? (
                  <div className="img-container">
                    {Array.from(file).map((item, index) => (
                      <img src={URL.createObjectURL(item)} alt="" key={index} />
                    ))}
                  </div>
                ) : file.length !== 1 && file.length !== 4 ? (
                  <div className="img-container">
                    {Array.from(file).map((item, index) => (
                      <img src={URL.createObjectURL(item)} alt="" key={index} />
                    ))}
                  </div>
                ) : (
                  ""
                )}

                <div id="close" onClick={() => setFile(null)}>
                  <i className="fa-solid fa-x"></i>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        "Loading"
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
              <AlertTitle>Create post successful!</AlertTitle>
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
