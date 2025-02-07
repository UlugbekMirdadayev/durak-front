import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import pako from "pako"; // Using pako instead of zlib for browser
import { Buffer } from "buffer";
const pusherConfig = {
  key: "e858f6b6e11dd35f3757",
  cluster: "eu",
  authEndpoint: "https://api-durak.frensgo.org/api/pusher/auth",
};

const usePusherGamesListener = () => {
  const [games, setGames] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  useEffect(() => {
    const pusher = new Pusher(pusherConfig.key, {
      cluster: pusherConfig.cluster,
      authEndpoint: pusherConfig.authEndpoint,
      auth: {
        headers: {
          Authorization: `Bearer 38|YhjgVWTJ1XgoFuJ09VzajvarVqdi7gpK1tFgT2Y33aa4cc23`,
          "Socket-Token":
            "sPr4LRL8TR30H8CmY5W1pXOCnt8N8AxyiG2OykynNOxgpIr5wWtR2xy3LvyI",
        },
      },
    });

    const channel = pusher.subscribe(`private-games`);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Успешно подключено к private-games");
    });

    channel.bind("pusher:subscription_error", (status) => {
      console.log(`Ошибка подключения. Статус: ${status}`);
    });

    channel.bind("games.updated", async function (data) {
      try {
        // Check if data is already an object
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        if (!parsedData.games) {
          throw new Error("No games data found");
        }

        // Decode the base64 string
        const decodedBuffer = Buffer.from(parsedData.games, "base64");

        // Decompress using pako instead of zlib
        const decompressedBuffer = pako.inflate(decodedBuffer);

        // Convert buffer to string
        const decompressedString = new TextDecoder().decode(decompressedBuffer);

        console.log(
          `Decompressed data size: ${decompressedString.length} bytes`
        );

        // Try to parse the decompressed string as JSON
        try {
          const jsonData = JSON.parse(decompressedString);
          console.log("Parsed JSON data:", jsonData);
          setGames(jsonData);
        } catch (jsonError) {
          console.log("The decompressed data is not valid JSON.", jsonError);
        }
      } catch (error) {
        console.error("Error during decoding or decompression:", error);
      }
    });
  }, [isOnline]);

  return { games };
};

export default usePusherGamesListener;
