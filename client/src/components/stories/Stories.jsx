import React, { useContext, useEffect, useRef, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import StoryItem from "../story/Story";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import CreateStory from "../createStory/CreateStory";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Loading from "../loading/Loading";

export default function Stories() {
  const stories = [
    {
      id: 1,
      name: "Huy Pham",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 2,
      name: "Huy Pham",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 3,
      name: "Huy Pham",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 4,
      name: "Huy Pham",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 5,
      name: "Huy Pham",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
  ];

  const { user } = useContext(AuthContext);

  const listRef = useRef();

  const [storyNumber, setStoryNumber] = useState(0);

  const [isMoveLeft, setIsMoveLeft] = useState(false);

  const [isMoveRight, setIsMoveRight] = useState(false);

  const [isOpenCreateStory, setIsOpenCreateStory] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + user.id).then((res) => {
        return res.data;
      }),
  });

  useEffect(() => {
    if (storyNumber > 0) {
      setIsMoveLeft(true);
    } else {
      setIsMoveLeft(false);
    }

    if (storyNumber < numOfStories - 4) {
      setIsMoveRight(true);
    } else {
      setIsMoveRight(false);
    }
  });

  let numOfStories = stories.length + 1;

  const handleSlider = (direction) => {
    let distance = listRef.current.getBoundingClientRect().x - 280;
    if (direction === "left" && storyNumber > 0) {
      setStoryNumber(storyNumber - 1);
      listRef.current.style.transform = `translateX( ${117 + distance}px)`;
    }

    if (direction === "right" && storyNumber < numOfStories - 4) {
      setStoryNumber(storyNumber + 1);
      listRef.current.style.transform = `translateX( ${-145 + distance}px)`;
    }
  };

  console.log(isOpenCreateStory);

  return (
    <div className="stories">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div
            className="arrow left"
            style={{ display: isMoveLeft ? "flex" : "none" }}
            onClick={() => handleSlider("left")}
          >
            <i className="fa-solid fa-angle-left"></i>
          </div>
          <div className="wrapper" ref={listRef}>
            <div
              className="upload-story"
              onClick={() => setIsOpenCreateStory(!isOpenCreateStory)}
            >
              <img src={"/upload/" + data.avatar} alt="" />
              <p>{`${data.firstName} ${data.lastName}`}</p>
              <button>+</button>
            </div>
            {stories.map((story) => (
              <StoryItem story={story} key={story.id} />
            ))}
          </div>
          <div
            className="arrow right"
            style={{ display: isMoveRight ? "flex" : "none" }}
            onClick={() => handleSlider("right")}
          >
            <i className="fa-solid fa-angle-right"></i>
            {isOpenCreateStory ? <CreateStory /> : ""}
          </div>
        </>
      )}
    </div>
  );
}
