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
export default function EditPost({
  post,
  setIsOpenEdit,
  setIsOpenOverlay,
  postImages,
}) {
  const { user } = useContext(AuthContext);

  const [openDialog, setOpenDialog] = useState(false);

  const [data, setData] = useState(post);

  const [images, setImages] = useState(postImages);

  const [fileEdit, setFileEdit] = useState(null);

  const queryClient = useQueryClient();

  const [currentImg, setCurrentImg] = useState(0);

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

  const mutationImages = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.put("/posts/updateImages?postID=" + post.id, newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleImage = (direction) => {
    let index = currentImg;

    if (direction === "left") {
      setCurrentImg(index - 1);
    }

    if (direction === "right") {
      setCurrentImg(index + 1);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsOpenOverlay(false);
    setIsOpenEdit(false);
  };

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const uploadMultiple = async () => {
    try {
      const formData = new FormData();
      for (const single_file of fileEdit) {
        formData.append("files", single_file);
      }
      const res = await makeRequest.post("/uploadMultiple", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  let imgURL = postImages;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileEdit !== null) imgURL = await uploadMultiple();
    mutation.mutate({ content: data.content });
    mutationImages.mutate({ image: imgURL });

    setIsOpenEdit(false);
    setIsOpenOverlay(false);
  };

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
          {images != null && images !== "" ? (
            <div className="img-place">
              <div
                style={
                  currentImg === 0 ? { display: "none" } : { display: "flex" }
                }
                onClick={() => handleImage("left")}
                className="button left"
              >
                {" "}
                <i className="fa-solid fa-angle-left"></i>
              </div>
              <img src={"/upload/" + images[currentImg].url} alt="" />
              <div id="close" onClick={() => setImages(null)}>
                <i className="fa-solid fa-x"></i>
              </div>

              <div
                style={
                  currentImg === postImages?.length - 1
                    ? { display: "none" }
                    : { display: "flex" }
                }
                onClick={() => handleImage("right")}
                className="button right"
              >
                {" "}
                <i className="fa-solid fa-angle-right"></i>
              </div>
              <div className="dots">
                {postImages.map((data, index) => (
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
          ) : fileEdit ? (
            <div className="bottom-2">
              {fileEdit.length > 4 ? (
                <div className="img-container">
                  {Array.from(fileEdit)
                    .splice(0, 3)
                    .map((item, index) => (
                      <img src={URL.createObjectURL(item)} alt="" key={index} />
                    ))}{" "}
                  <div className="img-4" num-img={`+ ${fileEdit.length - 4}`}>
                    <img src={URL.createObjectURL(fileEdit[4])} alt="" />{" "}
                  </div>
                </div>
              ) : fileEdit.length === 1 ? (
                <div
                  className="img-container"
                  style={{ gridTemplateColumns: "repeat(1, 1fr)" }}
                >
                  {Array.from(fileEdit).map((item, index) => (
                    <img
                      src={URL.createObjectURL(item)}
                      alt=""
                      key={index}
                      style={{ height: "100%" }}
                    />
                  ))}
                </div>
              ) : fileEdit.length !== 1 && fileEdit.length !== 4 ? (
                <div className="img-container">
                  {Array.from(fileEdit).map((item, index) => (
                    <img src={URL.createObjectURL(item)} alt="" key={index} F />
                  ))}
                </div>
              ) : (
                ""
              )}

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
                multiple
                type="file"
                id="fileEdit"
                style={{ display: "none" }}
                onChange={(e) => {
                  setFileEdit(e.target.files);
                  setImages(fileEdit);
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
