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

export default function UserItem2({ data, currentProfile, fData }) {
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
  });

  const {
    isLoading: rIsLoading2,
    error: rError2,
    data: rData2,
  } = useQuery({
    queryKey: ["checkFollow2"],
    queryFn: () =>
      makeRequest
        .get("/relationships?followedUserID=" + data.followedUserID)
        .then((res) => {
          return res.data;
        }),
  });

  const mutationFollow = useMutation({
    mutationFn: ([followed, userID]) => {
      if (followed)
        return makeRequest.delete(
          "/relationships?currentProfile=" + currentProfile
        );
      return makeRequest.post("/relationships", {
        currentProfile: userID,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleFollow = (userID) => {
    console.log("click");
    console.log(userID);
    mutationFollow.mutate([rData?.includes(user.id), userID]);
  };

  const mutationRemoveFollow = useMutation({
    mutationFn: () => {
      return makeRequest.delete(
        "/relationships?currentProfile=" + data.followedUserID
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleRemove = () => {
    mutationRemoveFollow.mutate();
  };

  return (
    <div className="user">
      <div className="left">
        <img src={`/upload/${data.avatar}`} alt="" />
        <p>{`${data.firstName} ${data.lastName}`}</p>
        <span
          className="follow-btn"
          onClick={() => {
            handleFollow(data.followerUserID);
          }}
          style={
            rData2?.includes(user.id)
              ? { display: "none" }
              : { display: "block" }
          }
        >
          Follow
        </span>
      </div>
      <div className="right">
        <button
          onClick={() => {
            handleRemove();
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
