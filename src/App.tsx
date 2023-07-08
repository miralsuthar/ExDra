import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Workspace } from "./components/Workspace";

type ExcaliState = {
  id: string;
  name: string;
  session: string | null;
};

const App = () => {
  //States
  const [name, setName] = useState<string>("");
  const [localExcaliState, setLocalExcaliState] = useState<
    ExcaliState[] | null
  >(null);
  // Local storage array of excalistates
  const [currentExcaliState, setCurrentExcaliState] = useState<string | null>(
    null
  );
  // const [existingState, setExistingState] = useState<any[] | null>(null);

  //Function to return the current excalistate of website
  const getCurrentExcaliState = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id && tabs[0].url?.includes("https://excalidraw.com/")) {
        chrome.scripting
          .executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              return window.localStorage.getItem("excalidraw");
            },
          })
          .then((res) => setCurrentExcaliState(res[0].result))
          .catch((err) => console.log(err));
      }
    });
  };

  // Function to get chrome local storage data of excaliState
  const getLocalStorage = () => {
    chrome.storage.local
      .get(["excaliState"])
      .then((res) => setLocalExcaliState(res["excaliState"]));
  };

  //Function to save excaliState to cherome local storage
  const saveExcaliState = () => {
    if (name !== "") {
      const existingState = localExcaliState;
      existingState?.push({
        id: uuid(),
        name: name,
        session: currentExcaliState,
      });
      chrome.storage.local.set({ excaliState: existingState });
    }
  };

  const modifyCurrentExcaliState = (value: string) => {
    window.localStorage.setItem("excalidraw", value);
    window.location.reload();
  };

  const replaceExistingExcaliState = (state: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id && tabs[0].url?.includes("https://excalidraw.com/")) {
        chrome.scripting
          .executeScript({
            target: { tabId: tabs[0].id },
            func: modifyCurrentExcaliState,
            args: [state],
          })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    });
  };

  const createNew = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id && tabs[0].url?.includes("https://excalidraw.com/")) {
        chrome.scripting
          .executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              window.localStorage.setItem("excalidraw", "[]");
              window.location.reload();
            },
          })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    });
  };

  useEffect(() => {
    if (localExcaliState === undefined) {
      chrome.storage.local.set({ excaliState: [] });
    }
  }, [localExcaliState]);

  useEffect(() => {
    getCurrentExcaliState();
    getLocalStorage();
  }, []);

  return (
    <div className="w-full p-4 h-full flex flex-col gap-4 font-jomhuria">
      <div>
        <h1 className="text-5xl">Exdra</h1>
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name for this workspace"
          className="border grow text-2xl border-black px-2 py-2 placeholder:text-[#ACACAC] placeholder:text-2xl bg-[#EEEEEE] rounded-md"
        />
        <button
          className="text-[2.65rem] leading-[107%] transition-shadow duration-200 w-full border border-black rounded-md hover:shadow-[2px_2px_0px_rgb(0,0,0)]"
          onClick={saveExcaliState}
        >
          Save
        </button>
        <div className="flex flex-col gap-2">
          {localExcaliState?.map((state) => (
            <Workspace
              title={state.name}
              onClick={() =>
                replaceExistingExcaliState(state.session as string)
              }
              onDelete={() => {
                console.log("delete");
              }}
            />
          ))}
        </div>
        <button
          onClick={createNew}
          className="text-[2.65rem] mt-auto leading-[107%] transition-shadow duration-200 w-full border border-black rounded-md hover:shadow-[2px_2px_0px_rgb(0,0,0)]"
        >
          New
        </button>
      </div>
    </div>
  );
};

export default App;
