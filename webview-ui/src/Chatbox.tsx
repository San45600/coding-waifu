import { useEffect, useState } from "react";
import { vscode } from "./utilities/vscode";

export function Chatbox(props: {
  text;
  setText;
  isLoading;
  setLoading;
  chatboxType;
  setChatboxType;
  playAudio;
  audioContext;
  audioPlayer;
  pendingText;
}) {
  const text = props.text.split("");
  const [streamingText, setStreamingText] = useState("");
  const [input, setInput] = useState("");
  useEffect(() => {
    setStreamingText("");
    const loop = () => {
      setStreamingText((prevState) => prevState + text.shift());
      if (text.length == 0) {
        props.setLoading(false);
      } else {
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  }, [props.text]);
  return (
    <>
      <div className="absolute text-black w-full z-50 bottom-56">
        <div className="fixed mx-auto left-0 right-0 text-4xl z-50 px-8 w-[32rem] font-lato">
          {streamingText}
        </div>
      </div>
      <div className="absolute flex gap-4 justify-center text-black w-full z-50 bottom-8">
        {props.chatboxType == "save" && !props.isLoading && (
          <Button
            onClick={() => {
              vscode.postMessage({
                command: "stage",
              });
            }}
            text={"Stage all file changes"}
          />
        )}
        {props.chatboxType == "commit" && !props.isLoading && (
          <>
            <Button
              onClick={() => {
                vscode.postMessage({
                  command: "stagepull",
                });
              }}
              text={"Pull"}
            />
            <Button
              onClick={() => {
                props.setChatboxType("message");
                props.pendingText.current = "";
                props.setText("Please tell me the commit message.");
                setInput("");
                props.playAudio(
                  props.audioContext,
                  props.audioPlayer,
                  "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/commitMessage.mp3"
                );
              }}
              text={"Commit"}
            />
          </>
        )}
        {props.chatboxType == "pull" && !props.isLoading && (
          <Button
            onClick={() => {
              props.setChatboxType("message");
              props.pendingText.current = "";
              props.setText("Please tell me the commit message.");
              setInput("");
              props.playAudio(
                props.audioContext,
                props.audioPlayer,
                "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/commitMessage.mp3"
              );
            }}
            text={"Commit"}
          />
        )}
        {props.chatboxType == "push" && !props.isLoading && (
          <Button
            onClick={() => {
              vscode.postMessage({
                command: "push",
              });
            }}
            text={"Push"}
          />
        )}
        {props.chatboxType == "message" && !props.isLoading && (
          <Input
            onConfirm={(e) => {
              e.preventDefault();
              vscode.postMessage({
                command: "commit",
                commitMessage: `'${input}'`,
              });
            }}
            confirmText={'Commit'}
            input={input}
            setInput={setInput}
            placeholder={'commit message'}
          />
        )}
        {props.chatboxType != "default" && !props.isLoading && (
          <Button
            onClick={() => {
              props.setChatboxType("default");
              props.pendingText.current = "";
              props.setText("Alright, Let's continue our work!");
              props.playAudio(
                props.audioContext,
                props.audioPlayer,
                "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/cancel.mp3"
              );
            }}
            text={"Cancel"}
          />
        )}
        {props.chatboxType == "default" && !props.isLoading && (
          <>
            <Button
              onClick={() => {
                vscode.postMessage({
                  command: "stage",
                });
              }}
              text={"Add"}
            />
            <Button
              onClick={() => {
                props.setChatboxType("message");
                props.pendingText.current = "";
                props.setText("Please tell me the commit message.");
                setInput("");
                props.playAudio(
                  props.audioContext,
                  props.audioPlayer,
                  "https://avatech-avatar-dev1.nyc3.cdn.digitaloceanspaces.com/coding-waifu/audio/commitMessage.mp3"
                );
              }}
              text={"Commit"}
            />
            <Button
              onClick={() => {
                vscode.postMessage({
                  command: "pull",
                });
              }}
              text={"Pull"}
            />
            <Button
              onClick={() => {
                vscode.postMessage({
                  command: "push",
                });
              }}
              text={"Push"}
            />
          </>
        )}
      </div>
    </>
  );
}

function Button(props: { onClick; text }) {
  return (
    <button
      className=" text-gray-500 text-xl px-2 py-1 rounded-2xl z-50 hover:bg-yellow-200 bg-opacity-40 whitespace-nowrap"
      onClick={props.onClick}>
      - {props.text}
    </button>
  );
}

export function Input(props: { onConfirm; input; setInput; className?; confirmText; placeholder; }) {
  const { onConfirm, input, setInput } = { ...props };
  return (
    <form className={!props.className ? "bg-[#969696] p-1 w-96 rounded-3xl flex items-center gap-2 justify-center " : props.className}>
      <div className="rounded-3xl w-full h-8 text-lg flex justify-between items-center bg-white px-2.5">
        <input
          type="text"
          aria-label="chat input"
          required
          className="px-1 w-full rounded-3xl focus:outline-none bg-white"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder={props.placeholder}
        />
        <button
          className={
            " bg-[#969696] rounded-xl flex justify-center items-center px-2 h-6 text-white font-lato"
          }
          type="submit"
          onClick={onConfirm}>
          {props.confirmText}
        </button>
      </div>
    </form>
  );
}
