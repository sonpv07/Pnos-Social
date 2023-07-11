import React from "react";
import "./relationships.scss";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Loading from "../loading/Loading";
import UserItem from "./UserItem1";
import UserItem2 from "./UserItem2";
import UserItem1 from "./UserItem1";

export default function Relationships({
  setIsOpenRelationships,
  currentProfile,
  fData,
  followList,
  handleFollow,
}) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getFollowers"],
    queryFn: () =>
      makeRequest
        .get("/relationships/find?followedUserID=" + currentProfile)
        .then((res) => {
          return res.data;
        }),
  });

  console.log(currentProfile);
  console.log(isLoading);

  return (
    <div className="relationships">
      <div className="relationships-container">
        <div className="title">Following</div>
        <div className="close" onClick={() => setIsOpenRelationships(false)}>
          <i className="fa-solid fa-x"></i>
        </div>
        <div className="user-list">
          {isLoading ? (
            <Loading />
          ) : followList === "follower" ? (
            data?.map((user) => (
              <UserItem1
                data={user}
                key={user.id}
                currentProfile={currentProfile}
                handleFollow={handleFollow}
              />
            ))
          ) : (
            fData?.map((user) => (
              <UserItem2
                data={user}
                key={user.id}
                currentProfile={currentProfile}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
