import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useState } from "react";
import { makeRequest } from "../../axios";
import "./EditProfile.scss";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useParams } from "react-router-dom";

export default function EditProfile({ setIsOpenEditProfile, userProfile }) {
  const { user, setUser } = useContext(AuthContext);
  console.log(userProfile);
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    username: userProfile.username,
    email: userProfile.email,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
  });

  const upload = async (file) => {
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userprofile) => {
      return makeRequest.put("/users", userprofile);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  let coverUrl = userProfile.coverPic;
  let profileUrl = userProfile.avatar;

  const handleClick = async (e) => {
    e.preventDefault();

    //TODO: find a better way to get image URL

    coverUrl = cover ? await upload(cover) : userProfile.coverPic;
    profileUrl = profile ? await upload(profile) : userProfile.avatar;

    mutation.mutate({ ...texts, coverPic: coverUrl, avatar: profileUrl });
    setIsOpenEditProfile(false);
    setCover(null);
    setProfile(null);
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile-container">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + userProfile.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + userProfile.avatar
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Username</label>
          <input
            type="text"
            value={texts.username}
            name="username"
            onChange={handleChange}
          />
          <label>First Name</label>
          <input
            type="text"
            value={texts.firstName}
            name="firstName"
            onChange={handleChange}
          />

          <label>Last Name</label>
          <input
            type="text"
            value={texts.lastName}
            name="lastName"
            onChange={handleChange}
          />

          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setIsOpenEditProfile(false)}>
          X
        </button>
      </div>
    </div>
  );
}
