import React from "react";
import "./SuggestList.scss";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { makeRequest } from "../../axios.js";
import SuggestItem from "./SuggestItem";

export default function SuggestList() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["suggest"],
    queryFn: () =>
      makeRequest.get("/relationships/getSuggest").then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="suggest-list">
      <h2 className="title">Suggest Follow: </h2>
      <div className="suggest-list-container">
        {data?.length > 0
          ? data?.map((user) => (
              <SuggestItem info={user} key={user.followedUserID} />
            ))
          : "Dont have any suggest"}
      </div>
    </div>
  );
}
