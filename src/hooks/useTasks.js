import useTaskStore from "../store/taskStore"

export const useTasks = () => {
  const { tasks, currentTask, setCurrentTask, addTask, updateTask, updateTaskStatus, deleteTask } =
    useTaskStore()
  return { tasks, currentTask, setCurrentTask, addTask, updateTask, updateTaskStatus, deleteTask }
}
