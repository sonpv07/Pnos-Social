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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function EditProfile({ setIsOpenEditProfile, userProfile }) {
  const { user, setUser } = useContext(AuthContext);
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    username: userProfile.username,
    email: userProfile.email,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    gender: userProfile.gender,
  });
  const [gender, setGender] = React.useState(userProfile.gender);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const uploadMultiple = async (file) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await makeRequest.post("/uploadMultiple", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["postsID"],
    queryFn: () =>
      makeRequest.get("/posts/allPost").then((res) => {
        return res.data;
      }),
  });

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

  const mutationActivites = useMutation({
    mutationFn: (activity) => {
      return makeRequest.post("/activities", activity);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const mutationPost = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  let coverUrl = userProfile.coverPic;
  let profileUrl = userProfile.avatar;

  let coverURLMultiple = "";
  let profileURLMultiple = "";

  const handleClick = async (e) => {
    e.preventDefault();

    coverUrl = cover ? await upload(cover) : userProfile.coverPic;
    profileUrl = profile ? await upload(profile) : userProfile.avatar;

    coverURLMultiple = cover
      ? await uploadMultiple(cover)
      : userProfile.coverPic;
    profileURLMultiple = profile
      ? await uploadMultiple(profile)
      : userProfile.avatar;

    mutation.mutate({
      ...texts,
      gender,
      coverPic: coverUrl,
      avatar: profileUrl,
    });
    if (profile) {
      mutationActivites.mutate({
        activityUserID: user.id,
        activityTypeID: 1,
        activityPostID: data[0]?.id + 1,
      });
      mutationPost.mutate({
        content: "",
        image: profileURLMultiple,
        postTypeID: 2,
      });
    }

    if (cover) {
      mutationActivites.mutate({
        activityUserID: user.id,
        activityTypeID: 2,
        activityPostID: data[0]?.id + 1,
      });
      mutationPost.mutate({
        content: "",
        image: coverURLMultiple,
        postTypeID: 3,
      });
    }

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
                {!userProfile.coverPic && <CloudUploadIcon className="icon" />}
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
                {!userProfile.avatar && <CloudUploadIcon className="icon" />}
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

          <FormControl
            sx={{ m: 1, minWidth: 120, margin: "15px 0 0 0" }}
            size="small"
          >
            <InputLabel id="demo-select-small-label">Gender</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={gender}
              label="Gender"
              onChange={(e) => setGender(e.target.value)}
              className="select-gender"
            >
              <MenuItem className="option" value={"Male"}>
                Male
              </MenuItem>
              <MenuItem className="option" value={"Female"}>
                Female
              </MenuItem>
            </Select>
          </FormControl>

          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setIsOpenEditProfile(false)}>
          X
        </button>
      </div>
    </div>
  );
}
