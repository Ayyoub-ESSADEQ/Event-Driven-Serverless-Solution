import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { LoadingDots } from "Pages/App/icons/LoadingDots";
import { ToDoManager } from "Pages/utils";
import { ToDo } from "Pages/utils/ToDoManager";

export interface ModalContentProps {
  hide: boolean;
  title?: string;
  description?: string;
  taskId?: string;
}

export interface ModalProps {
  modalProps?: ModalContentProps;
  setTaskList?: React.Dispatch<React.SetStateAction<ToDo[]>>;
  setModalProps?: React.Dispatch<React.SetStateAction<ModalContentProps>>;
}

export const ModalContext = createContext<ModalProps>({});

export function Modal() {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setTaskList, modalProps, setModalProps } = useContext(ModalContext);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");

  useEffect(() => {
    if (modalProps) {
      setInputTitle(modalProps.title ?? "");
      setInputDescription(modalProps.description ?? "");
    }
  }, [modalProps]);

  if (modalProps?.hide) return null;

  const hideModal = () => {
    setModalProps?.(() => ({
      title: "",
      description: "",
      taskId: undefined,
      hide: true,
    }));
  };

  const saveData = async () => {
    if (inputTitle === "" ?? inputDescription === "") return;

    try {
      setIsLoading(true);
      if (modalProps?.taskId) {
        await ToDoManager.getInstance().updateToDo({
          taskId: modalProps.taskId,
          title: inputTitle,
          description: inputDescription,
        });

        setTaskList?.((prev) =>
          prev.map((task) => {
            if (task.taskId === modalProps?.taskId) {
              task.description = inputDescription;
              task.title = inputTitle;
              return task;
            }

            return task;
          })
        );
      } else {
        const newToDo = await ToDoManager.getInstance().addToDo({
          title: inputTitle,
          description: inputDescription,
        });

        setTaskList?.((prev) => [
          {
            title: inputTitle,
            description: inputDescription,
            taskId: newToDo,
            finished: false,
            userId: "",
          },
          ...prev,
        ]);
      }

      hideModal();
    } catch (error) {
      console.error("Failed to save data", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed flex items-center px-2 justify-center size-full bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="max-w-[800px] z-40 flex flex-col w-[800px] h-fit bg-white p-6 rounded-lg gap-3">
        <div className="flex z-[200] w-full h-fit flex-col justify-start">
          <div className="font-medium">Title</div>
          <input
            type="text"
            className="w-full focus:outline-none"
            placeholder="What do you need to do?"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            ref={titleRef}
          />
        </div>

        <div className="flex w-full h-fit flex-col justify-start">
          <div className="font-medium">Description</div>
          <input
            type="text"
            className="w-full focus:outline-none"
            placeholder="Describe what you are willing to do.."
            value={inputDescription}
            onChange={(e) => setInputDescription(e.target.value)}
            ref={descriptionRef}
          />
        </div>

        <div className="flex justify-end gap-3 w-full h-fit flex-row">
          <button
            className="px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
            type="button"
            onClick={hideModal}
          >
            Cancel
          </button>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
            onClick={saveData}
          >
            {isLoading ? <LoadingDots /> : "Save"}
          </button>
        </div>
      </div>
      <div onClick={hideModal} className="absolute left-0 top-0 size-full" />
    </div>
  );
}
