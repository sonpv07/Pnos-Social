import React, { useEffect, useState } from "react";
import "./CreateStory.scss";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { makeRequest } from "../../axios.js";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function CreateStory({ setOpenCreateStory }) {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);

  const [story, setStory] = useState(null);

  const { isLoading, error, data } = useQuery({
    // take latest stories ID
    queryKey: ["activityID"],
    queryFn: () =>
      makeRequest.get("/stories/getStoryID").then((res) => {
        return res.data;
      }),
  });

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", story);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  // Mutations
  const mutation = useMutation({
    mutationFn: (story) => {
      return makeRequest.post("/stories", story);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const mutationActivites = useMutation({
    mutationFn: (activity) => {
      return makeRequest.post("/activities", activity);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (story) imgUrl = await upload();
    mutation.mutate({ image: imgUrl });
    mutationActivites.mutate({
      activityUserID: user.id,
      activityTypeID: 4,
      activityStoryID: data[0]?.id + 1,
    });
    setStory(null);
    setOpenCreateStory(false);
  };

  return (
    <div className="create-story">
      <form onSubmit={handleSubmit}>
        <div className="create-story-container">
          <h2>Create Your Story</h2>
          <div className="image-container">
            <img src={story ? URL.createObjectURL(story) : ""} alt="" />
            {!story ? (
              <div className="input">
                <input
                  id="story"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => setStory(e.target.files[0])}
                />
                <label htmlFor="story">Upload Your Image</label>
              </div>
            ) : (
              ""
            )}
          </div>

          <button type="submit" className="submit">
            Create
          </button>
          <button className="close" onClick={() => setOpenCreateStory(false)}>
            X
          </button>
        </div>
      </form>
    </div>
  );
}
