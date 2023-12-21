import React, { useContext } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

export default function UserItem3({
  data,
  currentProfile,
  setIsOpenRelationships,
}) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const {
    isLoading: rIsLoading,
    error: rError,
    data: rData,
  } = useQuery({
    queryKey: ["checkFollow"],
    queryFn: () =>
      makeRequest
        .get("/relationships?followedUserID=" + currentProfile)
        .then((res) => {
          return res.data;
        }),
  }); // nhung dua follow current profile

  const {
    isLoading: rIsLoading2,
    error: rError2,
    data: rData2,
  } = useQuery({
    queryKey: ["checkFollow2"],
    queryFn: () =>
      makeRequest
        .get("/relationships/findFollowing?followerUserID=" + user.id)
        .then((res) => {
          return res.data;
        }),
  }); //nhung dua minh follow

  let check = undefined;

  rData2?.filter((abc) => {
    if (abc.followedUserID === data.id) check = abc.followedUserID;
  });
  const mutationFollow = useMutation({
    mutationFn: (userID) => {
      return makeRequest.post("/relationships", {
        currentProfile: userID,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const mutationRemoveFollow = useMutation({
    mutationFn: (userID) => {
      return makeRequest.delete("/relationships?currentProfile=" + userID);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleRemove = (userID) => {
    mutationRemoveFollow.mutate(userID);
  };

  const handleFollow = (userID) => {
    mutationFollow.mutate(userID);
  };

  return data.id === user.id ? (
    <div className="user">
      <div className="left">
        <img src={`/upload/${data.avatar}`} alt="" />
        <p>{data.name}</p>
        <span>You</span>
      </div>
      <div className="right" style={{ display: "none" }}>
        {currentProfile != user.id && check !== data.followerUserID ? (
          <button
            onClick={() => {
              handleFollow(user.id);
            }}
            className="follow-btn"
          >
            Follow
          </button>
        ) : currentProfile != user.id && check === data.followerUserID ? (
          <button
            onClick={() => {
              handleRemove(user.id);
            }}
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={() => {
              handleRemove(data.followerUserID);
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="user">
      <div
        className="left"
        onClick={() => {
          navigate(`/profile/${data.id}`);
          setIsOpenRelationships(false);
        }}
      >
        <img src={`/upload/${data.avatar}`} alt="" />
        <p>{data.name}</p>
      </div>
      <div className="right">
        {(data.id != user.id && check !== data.id) || check === undefined ? (
          <button
            onClick={() => {
              handleFollow(data.id);
            }}
            className="follow-btn"
          >
            Follow
          </button>
        ) : data.id != user.id && check === data.id ? (
          <button
            onClick={() => {
              handleRemove(data.id);
            }}
          >
            Unfollow
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
