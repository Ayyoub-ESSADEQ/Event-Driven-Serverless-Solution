import axios from "axios";
import config from "Shared/Configuration/config.json";

export interface ToDo {
  title: string;
  finished: boolean;
  description: string;
  userId: string;
  taskId: string;
}

interface ToDoRequest {
  taskId: string;
  title ?: string;
  finished ?: boolean;
  description ?: string;
}

interface ToDoManagerInterface {
  getAllToDos: () => Promise<ToDo[]>;
  getToDo: (taskId: string) => Promise<ToDo | null>;
  deleteToDo: (taskId: string) => Promise<void>;
  addToDo: (
    newToDo: Omit<ToDo, "userId" | "taskId" | "finished">
  ) => Promise<string>;
  updateToDo: (task: Omit<ToDo, "userId">) => Promise<void>;
  completeToDo: (taskId: string) => Promise<void>;
}

export class ToDoManager implements ToDoManagerInterface {
  private static instance?: ToDoManager;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ToDoManager();
      return this.instance;
    }

    return this.instance;
  }

  public async getAllToDos() {
    try {
      const { data }: { data: ToDo[] } = await axios.get(
        `${config.api}/todos`,
        {
          headers: {
            Authorization: `${sessionStorage.idToken}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
  }

  public async getToDo(taskId: string) {
    try {
      const { data }: { data: ToDo } = await axios.get(
        `${config.api}/todos/${taskId}`,
        {
          headers: {
            Authorization: `${sessionStorage.idToken}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(`Error fetching todo ${taskId}:`, error);
      return null;
    }
  }

  public async deleteToDo(taskId: string) {
    try {
      await axios.delete(`${config.api}/todos/${taskId}`, {
        headers: {
          Authorization: `${sessionStorage.idToken}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting todo ${taskId}:`, error);
    }
  }

  public async addToDo(newToDo: Omit<ToDo, "userId" | "taskId" | "finished">) {
    try {
      const { data }: { data: { taskId: string } } = await axios.post(
        `${config.api}/todos`,
        newToDo,
        {
          headers: {
            Authorization: `${sessionStorage.idToken}`,
          },
        }
      );

      return data.taskId;
    } catch (error) {
      console.error("Error adding todo:", error);
      return "";
    }
  }

  public async updateToDo(task: ToDoRequest) {
    const {taskId, ...newData} = task;
    try {
      await axios.patch(`${config.api}/todos/${taskId}`, newData, {
        headers: {
          Authorization: `${sessionStorage.idToken}`,
        },
      });
    } catch (error) {
      console.error(`Error updating todo ${task.taskId}:`, error);
    }
  }

  public async completeToDo(taskId: string) {
    try {
      await axios.patch(
        `${config.api}/todos/${taskId}`,
        { finished: true },
        {
          headers: {
            Authorization: `${sessionStorage.idToken}`,
          },
        }
      );
    } catch (error) {
      console.error(`Error completing todo ${taskId}:`, error);
    }
  }
}
