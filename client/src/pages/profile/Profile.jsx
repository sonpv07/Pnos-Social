import React, { useContext, useEffect, useReducer, useState } from "react";
import "./Profile.scss";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Posts from "../../components/posts/Posts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import PreviewImage from "./PreviewImage";
import CreateStory from "../../components/createStory/CreateStory";

export default function Profile() {
  let currentProfile = useParams();

  const queryClient = useQueryClient();

  const [isOpenEditProfile, setIsOpenEditProfile] = useState(false);

  const [isOpenRelationships, setIsOpenRelationships] = useState(false);

  const [isOpenPreviewImage, setIsOpenPreviewImage] = useState(false);

  const [openCreateStory, setOpenCreateStory] = useState(false);

  const { user, setUser } = useContext(AuthContext);

  const [avatarPost, setAvatarPost] = useState(null);

  const [coverImgPost, setCoverImgPost] = useState(null);

  const [followList, setFollowList] = useState("");

  const [isPrivate, setIsPrivate] = useState(null);

  const [checkFollowRequest, setCheckFollowRequest] = useState(null);

  const nav = useNavigate();

  let avatarPostArr;

  let coverImgPostArr;

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", currentProfile.id],
    queryFn: () =>
      makeRequest.get("/users/find/" + currentProfile.id).then((res) => {
        return res.data;
      }),
  });

  const gender = data?.gender === "Male" ? "his" : "her";

  const {
    isLoading: profilePostLoading,
    error: profilePostError,
    data: profilePostData,
  } = useQuery({
    queryKey: ["profilePosts", currentProfile.id],
    queryFn: () =>
      makeRequest
        .get("/posts/profilePosts?currentProfile=" + currentProfile.id)
        .then((res) => {
          return res.data;
        }),
  });

  const { data: followRequest } = useQuery({
    queryKey: ["followRequest", currentProfile.id],
    queryFn: () =>
      makeRequest.get("/followRequest/" + currentProfile.id).then((res) => {
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

  const mutationFollowRequest = useMutation({
    mutationFn: (followed) => {
      return makeRequest.post("/followRequest", followed);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["followRequest"] });
    },
  });

  const removeFollowRequest = useMutation({
    mutationFn: (followed) => {
      console.log(followed);
      return makeRequest.delete("/followRequest/remove", followed);
    },
    onSuccess: () => {
      // Invalidate and refetch
      console.log("abc");
      queryClient.invalidateQueries({ queryKey: ["followRequest"] });
    },
  });

  const {
    isLoading: rIsLoading,
    error: rError,
    data: rData,
  } = useQuery({
    queryKey: ["relationships", currentProfile.id],
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
    queryKey: ["getFollowing", currentProfile.id],
    queryFn: () =>
      makeRequest
        .get("/relationships/findFollowing?followerUserID=" + currentProfile.id)
        .then((res) => {
          return res.data;
        }),
  });

  const handleFollow = () => {
    if (data?.isPrivate === 0) {
      mutationFollow.mutate(rData?.includes(user.id));
    } else {
      mutationFollowRequest.mutate({
        followedUserID: currentProfile.id,
        followingUserID: user.id,
      });
    }
  };

  const handleRemoveFollowRequest = () => {
    removeFollowRequest.mutate({
      followedUserID: currentProfile.id,
      followingUserID: user.id,
    });
  };

  // finding id of avatar post
  useEffect(() => {
    avatarPostArr = profilePostData?.filter((post) => post.postTypeID === 2);
    if (avatarPostArr) {
      setAvatarPost(avatarPostArr.splice(0, 1));
    }
  }, [profilePostData]);

  // finding id of avatar post
  useEffect(() => {
    coverImgPostArr = profilePostData?.filter((post) => post.postTypeID === 3);
    if (avatarPostArr) {
      setCoverImgPost(coverImgPostArr.splice(0, 1));
    }
  }, [profilePostData]);

  useEffect(() => {
    setIsPrivate(data?.isPrivate);

    if (rData?.find((data) => data === user.id)) {
      setIsPrivate(0);
    }

    if (currentProfile.id === user.id.toString()) {
      setIsPrivate(0);
    }
  }, [rData]);

  // check if follow request is sent
  useEffect(() => {
    const check = followRequest?.find(
      (data) => data.followingUserID === user.id
    );
    if (check) {
      setCheckFollowRequest(true);
    } else {
      setCheckFollowRequest(false);
    }
  }, [currentProfile?.id, followRequest, user.id]);

  return (
    <div className="profile">
      {!isLoading ? (
        <>
          <div
            className="images"
            onClick={() => nav(`/post/${coverImgPost[0]?.id}`)}
          >
            <img src={"/upload/" + data.coverPic} alt="" className="cover" />
          </div>
          <div className="profile-container">
            <div className="first-row">
              <div
                className="avatar-container"
                onClick={() => nav(`/post/${avatarPost[0]?.id}`)}
              >
                <img src={"/upload/" + data.avatar} alt="" className="avatar" />
              </div>
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
                {checkFollowRequest === false ? (
                  data.id === user.id ? (
                    <button
                      onClick={() => {
                        setIsOpenEditProfile(true);
                      }}
                    >
                      Edit Profile
                    </button>
                  ) : rData?.includes(user.id) ? (
                    <button onClick={handleFollow}>Unfollow</button>
                  ) : (
                    <button className="chat-btn" onClick={handleFollow}>
                      Following
                    </button>
                  )
                ) : (
                  <button onClick={handleRemoveFollowRequest}>
                    Request Sent
                  </button>
                )}

                {data.id === user.id ? (
                  <button
                    className="chat-btn"
                    onClick={() => setOpenCreateStory(true)}
                  >
                    Create Story
                  </button>
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
      {/* {isOpenPreviewImage === "avatar" ? (
        <PreviewImage
          image={data?.avatar}
          setIsOpenPreviewImage={setIsOpenPreviewImage}
        />
      ) : isOpenPreviewImage === "cover" ? (
        <PreviewImage
          image={data?.coverPic}
          setIsOpenPreviewImage={setIsOpenPreviewImage}
        />
      ) : (
        ""
      )} */}

      {openCreateStory === true ? (
        <CreateStory setOpenCreateStory={setOpenCreateStory} />
      ) : (
        ""
      )}

      {isPrivate === 0 ? (
        <div className="post-place">
          {profilePostData?.length > 0 ? (
            profilePostData?.map((post) => <Post post={post} key={post.id} />)
          ) : (
            <p className="nothing">
              {data?.firstName} does not create any posts yet
            </p>
          )}
        </div>
      ) : (
        <p className="nothing">{`This profile is private, follow to see ${gender} posts`}</p>
      )}

      {/* {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />} */}
    </div>
  );
}
