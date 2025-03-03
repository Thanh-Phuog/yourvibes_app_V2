import React, { useEffect, useRef } from "react";
import { Carousel } from "@ant-design/react-native";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import useColor from "@/src/hooks/useColor";
import { PostMediaModel } from "@/src/api/features/post/models/PostResponseModel";
import { useFocusEffect } from "@react-navigation/native";

interface MediaViewProps {
  mediaItems: PostMediaModel[];
  isVisible?: boolean;
}

const MediaView: React.FC<MediaViewProps> = React.memo(({ mediaItems, isVisible }) => {
  const { brandPrimary, lightGray } = useColor();
  // useRef để lưu trữ danh sách video player
  const videoPlayers = useRef<Record<string, any>>({});

  // Đăng ký video player vào danh sách khi video được render
  const registerVideoPlayer = (id: string, player: any) => {
    videoPlayers.current[id] = player;
  };

  // Hủy đăng ký video player khi video không còn hiển thị
  const unregisterVideoPlayer = (id: string) => {
    delete videoPlayers.current[id];
  };

  // Dừng tất cả video khi component mất focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        Object.values(videoPlayers.current).forEach((player) => {
          if (player && typeof player.pause === "function") {
            player.pause();
          }
        });
      };
    }, [])
  );

  useEffect(() => {
    if (isVisible) {
      // Play all videos when visible
      Object.values(videoPlayers.current).forEach((player) => {
        if (player && typeof player.play === "function") {
          player.play();
        }
      });
    } else {
      // Pause all videos when not visible
      Object.values(videoPlayers.current).forEach((player) => {
        if (player && typeof player.pause === "function") {
          player.pause();
        }
      });
    }
  }, [isVisible]);

  return (
    <Carousel
      style={{ backgroundColor: "#fff", width: "100%", minHeight: 250 }}
      dotActiveStyle={{ backgroundColor: brandPrimary }}
      dotStyle={{ backgroundColor: lightGray }}
    >
      {mediaItems?.map((media, index) => {
        const isVideo = media?.media_url?.endsWith(".mp4") || media?.media_url?.endsWith(".mov");

        if (isVideo) {
          const player = useVideoPlayer({ uri: media?.media_url || "" }, (player) => {
            player.loop = true;
            if (isVisible) {
              player.play();
            } else {
              player.pause();
            }
          });

          // Register the player after it's created
          useEffect(() => {
            if (player) {
              registerVideoPlayer(media.id as string, player);
            }
            return () => {
              unregisterVideoPlayer(media.id as string);
            };
          }, [player]);

          return (
            <VideoView
              key={index}
              style={{ height: 250 , width: "100%" }}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          );
        } else {
          return (
            <Image
              key={index}
              source={{ uri: media?.media_url }}
              style={{ width: "100%", height: 250 }}
              contentFit="contain"
              contentPosition={"center"}
            />
          );
        }
      })}
    </Carousel>
  );
});

export default MediaView;
