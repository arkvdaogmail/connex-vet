import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { tasks } from "@/mocks/tasks";

type Task = {
    id: string;
    title: string;
    completed: boolean;
};

type Tasks = {
    id: string;
    title: string;
    icon: string;
    iconColor: string;
    showCompleted: boolean;
    tasks: Task[];
};

type Store = {
    tasks: Tasks[];
    updateGroupOrder: (sourceIndex: number, destinationIndex: number) => void;
    addNewGroup: (title: string, icon: string, colorIcon: string) => void;
    removeGroup: (groupId: string) => void;
    duplicateGroup: (groupId: string) => void;
    clearGroup: (groupId: string) => void;
    updateTitleGroup: (groupId: string, newTitle: string) => void;
    updateIconGroup: (groupId: string, newIcon: string) => void;
    updateIconColorGroup: (groupId: string, newColor: string) => void;
    addNewTask: (groupId: string, title: string) => void;
    toggleTaskCompletion: (groupId: string, taskId: string) => void;
    updateTaskOrder: (
        activeGroupId: string | null,
        sourceIndex: number,
        destinationIndex: number
    ) => void;
    toggleShowCompleted: (groupId: string) => void;
    updateTitleTask: (
        groupId: string,
        taskId: string,
        newTitle: string
    ) => void;
    duplicateTask: (groupId: string, taskId: string) => void;
    deleteTask: (groupId: string, taskId: string) => void;
};

const useTasksStore = create<Store>((set) => ({
    tasks,
    updateGroupOrder: (sourceIndex, destinationIndex) => {
        set((state) => {
            const newTasks = [...state.tasks];
            const [removed] = newTasks.splice(sourceIndex, 1);
            newTasks.splice(destinationIndex, 0, removed);

            return { tasks: newTasks };
        });
    },
    addNewGroup: (title, icon, colorIcon) => {
        if (!title) return;

        set((state) => ({
            tasks: [
                ...state.tasks,
                {
                    id: uuidv4(),
                    title: title,
                    icon: icon,
                    iconColor: colorIcon,
                    tasks: [],
                    showCompleted: true,
                },
            ],
            icon: "smile",
            colorIcon: "#CBCBCB",
        }));
    },
    removeGroup: (groupId) => {
        set((state) => ({
            tasks: state.tasks.filter((group) => group.id !== groupId),
        }));
    },
    duplicateGroup: (groupId) => {
        set((state) => {
            const groupIndex = state.tasks.findIndex(
                (group) => group.id === groupId
            );
            if (groupIndex === -1) return state;

            const duplicatedGroup = {
                ...state.tasks[groupIndex],
                id: uuidv4(),
            };

            const newTasks = [...state.tasks];
            newTasks.splice(groupIndex + 1, 0, duplicatedGroup);

            return { tasks: newTasks };
        });
    },
    clearGroup: (groupId) => {
        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId ? { ...group, tasks: [] } : group
            ),
        }));
    },
    updateTitleGroup: (groupId, newTitle) => {
        if (!newTitle.trim()) return;

        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId ? { ...group, title: newTitle } : group
            ),
        }));
    },
    updateIconGroup: (groupId, newIcon) => {
        if (!newIcon.trim()) return;

        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId ? { ...group, icon: newIcon } : group
            ),
        }));
    },
    updateIconColorGroup: (groupId, newColor) => {
        if (!newColor.trim()) return;

        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId ? { ...group, iconColor: newColor } : group
            ),
        }));
    },
    addNewTask: (groupId, title) => {
        if (!title) return;

        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: [
                              ...group.tasks,
                              {
                                  id: uuidv4(),
                                  title,
                                  completed: false,
                              },
                          ],
                      }
                    : group
            ),
        }));
    },
    toggleTaskCompletion: (groupId, taskId) => {
        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.map((task) =>
                              task.id === taskId
                                  ? { ...task, completed: !task.completed }
                                  : task
                          ),
                      }
                    : group
            ),
        }));
    },
    updateTaskOrder: (activeGroupId, sourceIndex, destinationIndex) => {
        set((state) => {
            const activeGroupIndex = state.tasks.findIndex(
                (group) => group.id === activeGroupId
            );

            const newTasks = [...state.tasks[activeGroupIndex].tasks];
            const [removed] = newTasks.splice(sourceIndex, 1);
            newTasks.splice(destinationIndex, 0, removed);

            const newGroupTasks = [...state.tasks];
            newGroupTasks[activeGroupIndex] = {
                ...newGroupTasks[activeGroupIndex],
                tasks: newTasks,
            };

            return { tasks: newGroupTasks };
        });
    },
    toggleShowCompleted: (groupId) => {
        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId
                    ? { ...group, showCompleted: !group.showCompleted }
                    : group
            ),
        }));
    },
    updateTitleTask: (groupId, taskId, newTitle) => {
        if (!newTitle.trim()) return;

        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.map((task) =>
                              task.id === taskId
                                  ? { ...task, title: newTitle }
                                  : task
                          ),
                      }
                    : group
            ),
        }));
    },
    duplicateTask: (groupId, taskId) => {
        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.reduce((acc, task) => {
                              acc.push(task);
                              if (task.id === taskId) {
                                  acc.push({
                                      ...task,
                                      id: uuidv4(),
                                  });
                              }
                              return acc;
                          }, [] as Task[]),
                      }
                    : group
            ),
        }));
    },
    deleteTask: (groupId, taskId) => {
        set((state) => ({
            tasks: state.tasks.map((group) =>
                group.id === groupId
                    ? {
                          ...group,
                          tasks: group.tasks.filter(
                              (task) => task.id !== taskId
                          ),
                      }
                    : group
            ),
        }));
    },
}));

export default useTasksStore;
