import { Archive, Logout, Task } from "Pages/App/icons";
import { Button } from "../Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function getHumanReadableDate() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const year = now.toLocaleDateString("en-US", {
    year: "numeric",
  });

  return [date, year];
}

export function Header({
  setContentType,
}: {
  setContentType: React.Dispatch<React.SetStateAction<string>>;
}) {
  const date = getHumanReadableDate();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"TASKS" | "ARCHIVE">("TASKS");

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex m-2 rounded-lg bg-opacity-50 backdrop-blur-md w-full select-none h-fit flex-row justify-between bg-white border-b px-4 py-2 items-center">
      <div></div>
      <div className="flex flex-row items-center">
        <div className="flex flex-col">
          <div className="text-[30px] font-black">{tab}</div>
          <div className="text-[14px] mt-[-8px]">
            Start where you are. Use what you have. Do what you can. - Arthur
            Ashe
          </div>
        </div>

        <div className="flex flex-col text-right justify-end font-bold text-[20px] max-md:hidden">
          <div>{date[0]}</div>
          <div>{date[1]}</div>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {tab === "ARCHIVE" ? (
          <Button
            onClick={() => {
              setTab("TASKS");
              setContentType("TASKS");
            }}
            title="Your tasks"
          >
            <Task className="size-6 text-gray-500 " />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setTab("ARCHIVE");
              setContentType("ARCHIVE");
            }}
            title="Archived tasks"
          >
            <Archive className="size-6 text-gray-500 " />
          </Button>
        )}
        <Button onClick={handleLogout} title="logout">
          <Logout className="size-6 text-gray-500 " />
        </Button>
      </div>
    </div>
  );
}
