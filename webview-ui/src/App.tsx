import "./App.css";
import {
  defaultAvatarLoaders,
  defaultBlendshapesService_2,
} from "@avatechai/avatars/default-loaders";

import { useAvatar } from "@avatechai/avatars/react";
import { useEffect, useRef, useState } from "react";
import { Chatbox, Input } from "./Chatbox";
import { ExternalVoiceSourceService } from "@avatechai/avatars/voice";
import { getRandomInt } from "./utilities/randomInt";
import { RxCross1 } from "react-icons/rx";

const externalAvatarVoiceService = new ExternalVoiceSourceService();

type ChatboxType = "default" | "save" | "commit" | "push" | "message" | "pull";

function App() {
  const [text, setText] = useState("");
  const pendingText = useRef("");
  const [isLoading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [avatarId, setAvatarId] = useState("54a01fd2-f5cd-4b2f-ba3a-e6640b418c84");
  const [input, setInput] = useState("");
  const [isAvatarLoaded, setAvatarLoaded] = useState(false);
  const [chatboxType, setChatboxType] = useState<ChatboxType>("default");
  const audioContext = useRef(null);
  const audioPlayer = useRef(new Audio());
  const [errorText, setErrorText] = useState("");
  const [isError, setError] = useState(false);

  const { avatarDisplay, handleFirstInteractionAudio } = useAvatar({
    // Avatar State
    avatarId: avatarId,

    className: "w-[30rem] h-[30rem] cursor-grab",
    // Loader + Plugins
    avatarLoaders: defaultAvatarLoaders,
    audioService: externalAvatarVoiceService,

    scale: 0.7,
    onAvatarLoaded: () => {
      setAvatarLoaded(true);
    },
    style: { width: "100%", height: "100%" },
  });

  const playAudio = (audioContextRef, audioPlayer, url) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        //@ts-ignore
        window.webkitAudioContext)();
      externalAvatarVoiceService.setAudioContextAndSource(
        audioContextRef.current,
        audioPlayer.current
      );
    }
    handleFirstInteractionAudio();
    return new Promise((resolve) => {
      audioPlayer.current.crossOrigin = "anonymous";
      audioPlayer.current.src = url;
      audioPlayer.current.muted = true;
      audioPlayer.current.onended = resolve;
      audioPlayer.current
        .play()
        .then(() => {
          audioPlayer.current.muted = false;
          if (pendingText.current) setText(pendingText.current);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const onReceiveMessage = (event) => {
    const message = event.data;
    switch (message.command) {
      case "save":
        if (isLoading) return;
        setLoading(true);
        const folder = message.path.split("/");
        const saveTemplate = [
          "Save it under the " +
            folder[folder.length - 2] +
            " folder? Got it! Do you want me to stage all files?",
          "Save it right here... Nice! Do you want me to stage all files?",
          "Wow! Updated file... Saved! Do you want me to stage all files?",
        ];
        const random = getRandomInt(3);
        pendingText.current = saveTemplate[random];
        setChatboxType("save");
        playAudio(
          audioContext,
          audioPlayer,
          `https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/save${random}.mp3`
        );
        break;
      case "stageFinish":
        if (isLoading) return;
        setLoading(true);
        setChatboxType("commit");
        const stagetext = "All file is staged! Don't forget to pull before committing your works.";
        pendingText.current = stagetext;
        playAudio(
          audioContext,
          audioPlayer,
          "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/stage.mp3"
        );
        break;
      case "stagepullFinish":
        if (isLoading) return;
        setLoading(true);
        setChatboxType("pull");
        const stagepulltext = "Pulled! You can safely commit your works now.";
        pendingText.current = stagepulltext;
        playAudio(
          audioContext,
          audioPlayer,
          "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/stagepull.mp3"
        );
        break;
      case "pullFinish":
        if (isLoading) return;
        setLoading(true);
        setChatboxType("default");
        const pulltext = "Pulled! What else can i help with?";
        pendingText.current = pulltext;
        playAudio(
          audioContext,
          audioPlayer,
          "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/pull.mp3"
        );
        break;
      case "commitFinish":
        if (isLoading) return;
        setLoading(true);
        setChatboxType("push");
        const committext = "Commit finished! Let's push the commit, shall we?";
        pendingText.current = committext;
        playAudio(
          audioContext,
          audioPlayer,
          "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/commit.mp3"
        );
        break;
      case "pushFinish":
        if (isLoading) return;
        setLoading(true);
        setChatboxType("default");
        const pushtext = "Pushed! Would you like to take a rest with me?";
        pendingText.current = pushtext;
        playAudio(
          audioContext,
          audioPlayer,
          "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/push.mp3"
        );
        break;
      case "error":
        if (isLoading) return;
        setLoading(true);
        setChatboxType("default");
        const errorText = "Oops! Something went wrong...";
        pendingText.current = errorText;
        setErrorText(message.error);
        setError(true);
        playAudio(
          audioContext,
          audioPlayer,
          "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/error.mp3"
        );
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("message", onReceiveMessage);
    return () => {
      window.removeEventListener("message", onReceiveMessage);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img
          src={
            "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/background.png"
          }
          className="absolute overflow-hidden object-cover h-full select-none"
        />
        {avatarDisplay}
        {started ? (
          <Chatbox
            text={text}
            setText={setText}
            setLoading={setLoading}
            isLoading={isLoading}
            chatboxType={chatboxType}
            setChatboxType={setChatboxType}
            playAudio={playAudio}
            audioContext={audioContext}
            audioPlayer={audioPlayer}
            pendingText={pendingText}
          />
        ) : (
          <>
            <Input
              className=" bg-[#969696] p-1 w-96 rounded-3xl flex items-center gap-2 justify-center absolute z-50 bottom-36"
              onConfirm={(e) => {
                e.preventDefault();
                setAvatarId(input);
              }}
              input={input}
              setInput={setInput}
              confirmText={"Change"}
              placeholder={"avatar id"}
            />
            <button
              className=" bg-black text-white text-2xl px-4 py-2 absolute rounded-2xl z-50 bottom-16"
              onClick={() => {
                setStarted(true);
                setLoading(true);
                setText("Hello! How can i help you today?");
                playAudio(
                  audioContext,
                  audioPlayer,
                  `https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/hello.mp3`
                );
              }}>
              Start
            </button>
          </>
        )}

        <img
          src={
            "https://cdn.discordapp.com/attachments/801710150963560499/1138769999721410570/Rectangle_8.png"
          }
          className="absolute overflow-hidden w-full h-96 bottom-0 object-cover select-none"
        />
      </div>
      {isError && (
        <div className="alert alert-error absolute bottom-2 right-0 mx-2 w-fit flex h-fit !rounded-xl justify-between !px-2 !py-1 z-50">
          <span className="text-xs">{errorText}</span>
          <div
            className="cursor-pointer w-fit h-fit"
            onClick={() => {
              setError(!isError);
            }}>
            <RxCross1 size={15} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
