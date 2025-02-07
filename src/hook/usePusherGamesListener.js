import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import pako from "pako"; // Using pako instead of zlib for browser
import { Buffer } from "buffer";
import { useSelector } from "react-redux";
const pusherConfig = {
  key: "e858f6b6e11dd35f3757",
  cluster: "eu",
  authEndpoint: "https://api-durak.frensgo.org/api/pusher/auth",
};

const usePusherGamesListener = () => {
  const [games, setGames] = useState([]);
  const [gameStatus, setGameStatus] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const user = useSelector(({ user }) => user);
  const game = useSelector(({ exitgame }) => exitgame?.game);

  useEffect(() => {
    const pusher = new Pusher(pusherConfig.key, {
      cluster: pusherConfig.cluster,
      authEndpoint: pusherConfig.authEndpoint,
      auth: {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Socket-Token": user?.socket_token,
        },
      },
    });

    const channel = pusher.subscribe(`private-games`);
    const gameStatusChannel = pusher.subscribe(`private-game.${game?.id}`);

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

    gameStatusChannel.bind("game.state.updated", (data) => {
      console.log("Game status:", data);
      setGameStatus(data);
    });
  }, [isOnline, user?.token, user?.socket_token, game?.id]);

  return { games, gameStatus };
};

export default usePusherGamesListener;
