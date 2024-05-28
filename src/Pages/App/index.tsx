import { Button } from "./Components/Button";
import { Header } from "./Components/Header";
import { Modal, ModalContentProps, ModalContext } from "./Components/Modal";
import { ToDo } from "./Components/ToDo";
import { Plus } from "./icons";

import "./assets/App.css";
import { useEffect, useState } from "react";
import { ToDoManager } from "Pages/utils";
import { ToDo as ToDoInterface } from "Pages/utils/ToDoManager";

const Loading = () => {
  return (
    <div className="flex max-w-[896px] bg-white rounded-md bg-opacity-50 backdrop-blur-md flex-col h-fit box-border w-full border-b p-2">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-300 rounded max-w-40"></div>
          <div className="h-2 bg-slate-300 rounded"></div>
          <div className="h-2 bg-slate-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const App = () => {
  const [modalProps, setModalProps] = useState<ModalContentProps>({
    hide: true,
  });

  const [taskList, setTaskList] = useState<ToDoInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contentType, setContentType] = useState("TASKS");

  const contextValue = {
    setModalProps: setModalProps,
    modalProps: modalProps,
    setTaskList: setTaskList,
  };

  useEffect(() => {
    (async () => {
      const tasks = await ToDoManager.getInstance().getAllToDos();
      setTaskList(tasks);
      setIsLoading(false);
    })();
  }, []);

  return (
    <ModalContext.Provider value={contextValue}>
      <div className="flex flex-col items-center px-2 bg-gradient-to-r from-violet-200 to-pink-200 size-full overflow-hidden">
        <Header setContentType={setContentType} />
        <div className="flex-grow overflow-auto w-full flex pb-20 flex-col items-center gap-2">
          {isLoading ? (
            <>
              <Loading />
              <Loading />
              <Loading />
            </>
          ) : (
            ""
          )}

          {taskList.map((task) => {
            if (contentType === "TASKS") {
              if (task.finished) return;
              return <ToDo task={task} key={task.taskId} />;
            }
            if (contentType === "ARCHIVE") {
              if (!task.finished) return;
              return <ToDo task={task} key={task.taskId} />;
            }
          })}
        </div>
        <div className="fixed w-fit bg-white bg-opacity-50 backdrop-blur-md px-2 h-14 bottom-0 pt-2 rounded-t-md">
          <Button
            onClick={() => setModalProps((prev) => ({ ...prev, hide: false }))}
            title="add a new task"
          >
            <Plus />
          </Button>
        </div>
        <Modal />
      </div>
    </ModalContext.Provider>
  );
};
