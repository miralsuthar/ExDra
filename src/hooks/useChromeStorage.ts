import { useEffect, useState } from "react";

type ExcaliState = {
  id: string;
  name: string;
  session: string | null;
};

export const useChromeStorage = (key: string) => {
  const [value, setValue] = useState<ExcaliState[] | null>(null);

  useEffect(() => {
    chrome.storage.local.get([key]).then((res) => setValue(res[key]));
  }, [key]);

  return { value };
};
