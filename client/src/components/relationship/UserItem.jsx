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

export default function UserItem({ data, currentProfile }) {
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

  console.log("rData", rData);

  return (
    <div className="user">
      <div className="left">
        <img src={`/upload/${data.avatar}`} alt="" />
        <p>{`${data.firstName} ${data.lastName}`}</p>

        {rData?.includes(user.id) ? (  // check data iinclude current user
          <span>You</span>
        ) : (
          <span
            className="follow-btn"
            onClick={() => {
              handleFollow(data.followerUserID);
            }}
          >
            Follow
          </span>
        )}
      </div>
      <div className="right">
        <button>Remove</button>
      </div>
    </div>
  );
}
