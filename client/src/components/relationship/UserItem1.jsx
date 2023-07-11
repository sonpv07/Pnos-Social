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
  });

  const {
    isLoading: rIsLoading2,
    error: rError2,
    data: rData2,
  } = useQuery({
    queryKey: ["checkFollow2"],
    queryFn: () =>
      makeRequest
        .get("/relationships?followedUserID=" + data.followerUserID)
        .then((res) => {
          return res.data;
        }),
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
    mutationFn: () => {
      return makeRequest.delete(
        "/relationships?currentProfile=" + data.followerUserID
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

  const handleFollow = (userID) => {
    console.log("click");
    console.log(userID);
    mutationFollow.mutate(userID);
  };

  console.log("rData2", rData2);
  console.log(data);
  return (
    <div className="user">
      <div className="left">
        <img src={`/upload/${data.avatar}`} alt="" />
        <p>{`${data.firstName} ${data.lastName}`}</p>

        {rData?.includes(user.id) ? ( // check data iinclude current user
          <span>You</span>
        ) : (
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
        )}
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
