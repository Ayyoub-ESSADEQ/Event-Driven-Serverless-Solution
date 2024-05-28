import { Task } from "Pages/App/icons";
import { Menu } from "../Menu";
import { createContext } from "react";
import { ToDo as ToDoInterface } from "Pages/utils/ToDoManager";

interface ToDoProps {
  task: ToDoInterface;
}

export const ToDoContext = createContext<ToDoProps | null>(null);

export function ToDo({ task }: Readonly<ToDoProps>) {
  return (
    <ToDoContext.Provider value={{ task }}>
      <div className="flex max-w-[896px] bg-white rounded-md bg-opacity-50 backdrop-blur-md flex-col h-fit box-border w-full border-b p-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start gap-1">
            <Task className="size-[20px] mt-1" />
            <div className="flex flex-col">
              <div className="font-medium">{task.title}</div>
              <div className="h-fit w-full text-justify">
                {task.description}
              </div>
            </div>
          </div>
          <Menu />
        </div>
      </div>
    </ToDoContext.Provider>
  );
}
