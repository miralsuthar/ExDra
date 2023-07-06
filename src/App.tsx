import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

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
    <div className="w-full p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4 justify-center items-start">
        <h1 className="text-center text-xl">Excali Save</h1>
        <div className="flex justify-start items-center gap-2">
          <input
            type="text"
            name=""
            id=""
            className="grow border border-slate-400 rounded-md px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="bg-black rounded-md px-2 py-1 text-white"
            onClick={saveExcaliState}
          >
            Save Button
          </button>
        </div>

        <button
          className="bg-black rounded-md px-2 py-1 text-white"
          // onClick={saveExcaliState}
        >
          Replace Excali Button
        </button>
        <button
          className="bg-black rounded-md px-2 py-1 text-white"
          onClick={() => chrome.storage.local.clear()}
        >
          Clear
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {localExcaliState &&
          localExcaliState.map((excali) => {
            return (
              <div
                className="cursor-pointer"
                onClick={() =>
                  replaceExistingExcaliState(excali.session as string)
                }
                key={excali.id}
              >
                {excali.name}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default App;
