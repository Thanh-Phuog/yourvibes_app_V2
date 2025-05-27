import React, { useEffect, useRef, useState, useCallback } from "react";
import { Carousel } from "@ant-design/react-native";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { Dimensions } from "react-native";
import useColor from "@/src/hooks/useColor";
import { PostMediaModel } from "@/src/api/features/post/models/PostResponseModel";
import { useFocusEffect } from "@react-navigation/native";

interface MediaViewProps {
  mediaItems: PostMediaModel[];
  isVisible?: boolean;
  maxHeight?: number;
}

const MediaView: React.FC<MediaViewProps> = React.memo(({ mediaItems, isVisible, maxHeight = 300 }) => {
  const { brandPrimary, lightGray } = useColor();
  const videoPlayers = useRef<Record<string, any>>({});
  const [mediaHeights, setMediaHeights] = useState<number[]>([]);
  const windowWidth = Dimensions.get("window").width;

  // Đăng ký và hủy video player
  const registerVideoPlayer = (id: string, player: any) => {
    videoPlayers.current[id] = player;
  };

  const unregisterVideoPlayer = (id: string) => {
    delete videoPlayers.current[id];
  };

  // Dừng video khi mất focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        Object.values(videoPlayers.current).forEach((player) => {
          player?.pause?.();
        });
      };
    }, [])
  );

  // Xử lý chiều cao ảnh khi tải xong
  const handleImageLoad = useCallback(
    (index: number, event: { width: number; height: number }) => {
      const { width, height } = event;
      if (width && height) {
        const aspectRatio = width / height;
        const calculatedHeight = Math.min(maxHeight, windowWidth / aspectRatio);
        setMediaHeights((prev) => {
          const newHeights = [...prev];
          newHeights[index] = calculatedHeight;
          return newHeights;
        });
      }
    },
    [maxHeight, windowWidth]
  );

  // Đặt chiều cao mặc định cho video hoặc khi ảnh chưa tải
  useEffect(() => {
    if (mediaItems?.length) {
      const initialHeights = mediaItems.map((media) => {
        const isVideo = media?.media_url?.endsWith(".mp4") || media?.media_url?.endsWith(".mov");
        return isVideo ? maxHeight : 0; // Video dùng maxHeight, ảnh chờ onLoad
      });
      setMediaHeights(initialHeights);
    }
  }, [mediaItems, maxHeight]);

  // Điều khiển video dựa trên isVisible
  useEffect(() => {
    Object.values(videoPlayers.current).forEach((player) => {
      if (isVisible) {
        player?.play?.();
      } else {
        player?.pause?.();
      }
    });
  }, [isVisible]);

  // Chọn chiều cao nhỏ nhất hoặc maxHeight
  const finalHeight = mediaHeights.length
    ? Math.min(...mediaHeights.filter((h) => h > 0), maxHeight) || maxHeight
    : maxHeight;

  return (
    <Carousel
      style={{ backgroundColor: "#fff", width: "100%", height: finalHeight }}
      dotActiveStyle={{ backgroundColor: brandPrimary }}
      dotStyle={{ backgroundColor: lightGray }}
    >
      {mediaItems?.map((media, index) => {
        const isVideo = media?.media_url?.endsWith(".mp4") || media?.media_url?.endsWith(".mov");

        if (isVideo) {
          const player = useVideoPlayer({ uri: media?.media_url || "" }, (player) => {
            player.loop = true;
            if (isVisible) player.play();
          });

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
              key={media.id || index}
              style={{ width: "100%", height: finalHeight }}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
              contentFit="cover"
            />
          );
        }

        return (
          <Image
            key={media.id || index}
            source={{ uri: media?.media_url }}
            style={{ width: "100%", height: finalHeight }}
            contentFit="cover"
            contentPosition="center"
            cachePolicy="memory-disk"
            onLoad={({ source }) => handleImageLoad(index, { width: source.width, height: source.height })}
          />
        );
      })}
    </Carousel>
  );
});

export default MediaView;