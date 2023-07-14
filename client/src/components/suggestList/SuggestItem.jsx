import React from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { makeRequest } from "../../axios.js";

export default function SuggestItem({ info }) {
  const queryClient = useQueryClient();

  const {
    isLoading: cLoading,
    error: cError,
    data: cData,
  } = useQuery({
    // take common users
    queryKey: ["commonSuggest", info.followedUserID],
    queryFn: () =>
      makeRequest
        .get("/relationships/getSuggestCommon?userID=" + info.followedUserID)
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

  const handleFollow = (userID) => {
    mutationFollow.mutate(userID);
  };

  let name = cData !== undefined ? cData[0]?.firstName : "error";

  let length = cData?.length - 1;

  return (
    <div className="suggest-item">
      <img src={`/upload/${info?.avatar}`} alt="" />
      <div className="user-info">
        <p>{info?.name}</p>
        <div className="common-follow">
          {length > 0 ? (
            <span>{`Following by ${name} and ${length} more  `}</span>
          ) : (
            <span>Following by {name} </span>
          )}
        </div>
        <div className="btn-place">
          <button onClick={() => handleFollow(info?.followedUserID)}>
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
