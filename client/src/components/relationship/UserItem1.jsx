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

export default function UserItem1({ data, currentProfile, fData }) {
  const queryClient = useQueryClient();

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
    if (abc.followedUserID === data.followerUserID) check = abc.followedUserID;
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

  const mutationRemoveFollower = useMutation({
    mutationFn: (userID) => {
      return makeRequest.delete(
        "/relationships/removeFollower?userID=" + userID
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleRemove = (userID) => {
    mutationRemoveFollower.mutate(userID);
  };

  const handleFollow = (userID) => {
    mutationFollow.mutate(userID);
  };

  console.log(rData2);

  return (
    <div className="user">
      <div className="left">
        <img src={`/upload/${data.avatar}`} alt="" />
        <p>{`${data.firstName} ${data.lastName}`}</p>

        {data.id === user.id ? ( // check data include current user
          <span>You</span>
        ) : (
          <span
            className="follow-btn"
            onClick={() => {
              handleFollow(data.followerUserID);
            }}
            style={
              user.id != currentProfile
                ? { display: "none" }
                : data.followerUserID === check
                ? { display: "none" }
                : { display: "block" }
            }
          >
            Follow
          </span>
        )}
      </div>
      <div className="right">
        {currentProfile != user.id && check !== data.followerUserID ? (
          <button
            onClick={() => {
              handleFollow(user.id);
            }}
            className="follow-btn"
          >
            Followed
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
  );
}
