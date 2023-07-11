import React, { useContext, useEffect, useReducer, useState } from "react";
import "./Profile.scss";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Posts from "../../components/posts/Posts";
import { useLocation, useParams } from "react-router-dom";
import CreatePost from "../../components/createPost/createPost";
import { AuthContext } from "../../context/authContext";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Post from "../../components/post/Post";
import EditProfile from "../../components/EditProfile/EditProfile";
import Relationships from "../../components/relationship/Relationships";

export default function Profile() {
  let currentProfile = useParams();

    const queryClient = useQueryClient();

  const [isOpenEditProfile, setIsOpenEditProfile] = useState(false);

  const [isOpenRelationships, setIsOpenRelationships] = useState(false);

  const { user, setUser } = useContext(AuthContext);

  const [followList, setFollowList] = useState("");

  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + currentProfile.id).then((res) => {
        return res.data;
      }),
  });

  const {
    isLoading: profilePostLoading,
    error: profilePostError,
    data: profilePostData,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest
        .get("/posts/profilePosts?currentProfile=" + currentProfile.id)
        .then((res) => {
          return res.data;
        }),
  });

  const mutationFollow = useMutation({
    mutationFn: (followed) => {
      if (followed)
        return makeRequest.delete(
          "/relationships?currentProfile=" + currentProfile.id
        );
      return makeRequest.post("/relationships", {
        currentProfile: currentProfile.id,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
    },
  });

  const {
    isLoading: rIsLoading,
    error: rError,
    data: rData,
  } = useQuery({
    queryKey: ["relationships"],
    queryFn: () =>
      makeRequest
        .get("/relationships?followedUserID=" + currentProfile.id)
        .then((res) => {
          return res.data;
        }),
  });

  const {
    isLoading: fIsLoading,
    error: fError,
    data: fData,
  } = useQuery({
    queryKey: ["getFollowing"],
    queryFn: () =>
      makeRequest
        .get("/relationships/findFollowing?followerUserID=" + currentProfile.id)
        .then((res) => {
          return res.data;
        }),
  });

  const handleFollow = () => {
    mutationFollow.mutate(rData?.includes(user.id));
  };

  console.log(isOpenEditProfile);

  return (
    <div className="profile">
      {!isLoading ? (
        <>
          <div className="images">
            <img src={"/upload/" + data.coverPic} alt="" className="cover" />
          </div>
          <div className="profile-container">
            <div className="first-row">
              <img src={"/upload/" + data.avatar} alt="" className="avatar" />

              <div className="follower">
                <p>
                  <span>{profilePostData?.length}</span> posts
                </p>
                <p
                  onClick={() => {
                    setIsOpenRelationships(true);
                    setFollowList("follower");
                  }}
                >
                  <span>{rData?.length}</span> followers
                </p>
                <p
                  onClick={() => {
                    setIsOpenRelationships(true);
                    setFollowList("following");
                  }}
                >
                  Following <span>{fData?.length}</span> users
                </p>
              </div>
            </div>

            <div className="user-info">
              <div className="left">
                <p className="username">{`${data.firstName} ${data.lastName} `}</p>
                <div className="social-media">
                  <FacebookOutlinedIcon
                    className="icon"
                    fontSize="large"
                    style={{ color: "blue" }}
                  />
                  <InstagramIcon
                    className="icon"
                    fontSize="large"
                    style={{ color: "#3f729b" }}
                  />
                  <TwitterIcon
                    className="icon"
                    fontSize="large"
                    style={{ color: "blue" }}
                  />
                </div>
              </div>

              <div className="right">
                {data.id === user.id ? (
                  <button
                    onClick={() => {
                      setIsOpenEditProfile(true);
                      console.log("abcd");
                    }}
                  >
                    Edit Profile
                  </button>
                ) : rData?.includes(user.id) ? (
                  <button onClick={handleFollow}>Followed</button>
                ) : (
                  <button className="chat-btn" onClick={handleFollow}>
                    Following
                  </button>
                )}

                {data.id === user.id ? (
                  <button className="chat-btn">Create Story</button>
                ) : (
                  <button className="chat-btn">Chat</button>
                )}
              </div>
            </div>
          </div>
          {data.id === user.id ? <CreatePost user={data} /> : ""}
        </>
      ) : (
        "Loading..."
      )}

      {isOpenEditProfile === true ? (
        <EditProfile
          setIsOpenEditProfile={setIsOpenEditProfile}
          userProfile={data}
        />
      ) : (
        ""
      )}

      {isOpenRelationships === true ? (
        <Relationships
          setIsOpenRelationships={setIsOpenRelationships}
          currentProfile={currentProfile.id}
          fData={fData}
          followList={followList}
          handleFollow={handleFollow}
        />
      ) : (
        ""
      )}

      <div className="post-place">
        {profilePostData?.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>

      {/* {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />} */}
    </div>
  );
}
