import { IconTrash } from "@tabler/icons-react";

type WorkspaceType = {
  title: string;
  onClick: () => void;
  onDelete: () => void;
};

export const Workspace = ({ title, onClick, onDelete }: WorkspaceType) => {
  return (
    <div
      onClick={onClick}
      className="bg-black rounded-md cursor-pointer text-white flex justify-between items-center"
    >
      <span className="px-3 py-2 pflex-1 text-2xl">{title}</span>
      <div
        onClick={onDelete}
        className="p-2 h-full cursor-pointer border-l border-white"
      >
        <IconTrash size={22} strokeWidth={2} />
      </div>
    </div>
  );
};
