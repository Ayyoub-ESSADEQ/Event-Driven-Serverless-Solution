import { Delete, Dots, Edit, Task } from "Pages/App/icons";
import { ReactNode, useContext, useRef, useState } from "react";
import { Popover } from "react-tiny-popover";
import { ToDoContext } from "../ToDo";
import { ToDoManager } from "Pages/utils";
import { ModalContext } from "../Modal";

interface ItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
  functionality: string;
}

const Item = ({ children, className, functionality, ...props }: ItemProps) => {
  return (
    <li
      className={`flex ${className} flex-row gap-1 items-center w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-100`}
      {...props}
    >
      {children}
      <div>{functionality}</div>
    </li>
  );
};

const MenuItems = ({
  setIsPopoverOpen,
}: {
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { task } = useContext(ToDoContext)!;
  const todoId = task.taskId;
  const { current } = useRef(ToDoManager.getInstance());
  const { setTaskList, setModalProps } = useContext(ModalContext);

  const deleteTask = async () => {
    setTaskList?.((prev) => prev.filter(({ taskId }) => taskId !== todoId));
    await current.deleteToDo(todoId);
  };

  const completeTask = async () => {
    setTaskList?.((prev) =>
      prev.map((task) => {
        if (task.taskId !== todoId) return task;
        task.finished = true;
        return task;
      })
    );

    await current.updateToDo({
      taskId: todoId,
      finished: true,
    });
  };

  const editToDo = () => {
    setIsPopoverOpen(false);
    setModalProps?.({
      hide: false,
      title: task.title,
      description: task.description,
      taskId: todoId,
    });
  };

  return (
    <ul className="min-w-[180px] overflow-auto rounded-md border bg-white bg-opacity-50 backdrop-blur-md p-3 font-sans text-sm font-normal shadow-lg">
      <Item functionality="Edit task" onClick={editToDo}>
        <Edit className="size-4" />
      </Item>

      <Item functionality="Mark as completed" onClick={completeTask}>
        <Task className="size-4" />
      </Item>

      <Item
        className="text-red-500"
        functionality="Delete task"
        onClick={deleteTask}
      >
        <Delete className="size-4" />
      </Item>
    </ul>
  );
};

export function Menu() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <div className="relative">
      <Popover
        isOpen={isPopoverOpen}
        positions={["bottom", "top", "left", "right"]} // preferred positions by priority
        content={<MenuItems setIsPopoverOpen={setIsPopoverOpen} />}
        onClickOutside={() => setIsPopoverOpen(false)}
      >
        <div
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className="flex flex-col items-center justify-center size-6 hover:bg-white hover:bg-opacity-30"
        >
          <Dots />
        </div>
      </Popover>
    </div>
  );
}
