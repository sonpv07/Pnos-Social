import React, { useContext, useEffect, useState } from "react";
import "./editPost.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { AuthContext } from "../../context/authContext";
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
export default function EditPost({ post, setIsOpenEdit, setIsOpenOverlay }) {
  const { user } = useContext(AuthContext);

  const [openDialog, setOpenDialog] = useState(false);

  const [data, setData] = useState(post);

  const [fileEdit, setFileEdit] = useState(null);

  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.put("/posts?postID=" + post.id, newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  console.log(data);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsOpenOverlay(false);
    setIsOpenEdit(false);
  };

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileEdit);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  let imgURL = data?.image;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileEdit !== null) imgURL = await upload();
    setData({ ...data, image: imgURL });
    mutation.mutate({ content: data.content, image: imgURL });
    setOpenDialog(true);
  };

  console.log(fileEdit);

  return (
    <div className="edit-post">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="container">
          <div className="top">
            <img src={`/upload/${data.avatar}`} alt="" className="avatar" />
            <div className="input-place">
              <textarea
                id="content"
                name="content"
                value={data.content}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </div>
          {data.image != null && data.image !== "" ? (
            <div className="img-place">
              <img src={"/upload/" + data.image} alt="" />
              <div id="close" onClick={() => setData({ ...data, image: null })}>
                <i className="fa-solid fa-x"></i>
              </div>
            </div>
          ) : fileEdit != null ? (
            <div className="img-place">
              <img src={URL.createObjectURL(fileEdit)} alt="" />
              <div id="close" onClick={() => setFileEdit(null)}>
                <i className="fa-solid fa-x"></i>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="bottom">
            <div className="left">
              <input
                type="file"
                id="fileEdit"
                style={{ display: "none" }}
                onChange={(e) => {
                  setFileEdit(e.target.files[0]);
                  setData({ ...data, image: fileEdit });
                }}
              />
              <label htmlFor="fileEdit">
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
              <button type="submit">Edit</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
// }
