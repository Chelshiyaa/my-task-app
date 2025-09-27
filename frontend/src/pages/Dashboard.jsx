import { useEffect, useState } from "react";
import { getTasks } from "../api/tasks";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import DarkModeToggle from "../components/ui/DarkModeToggle";
import { TaskExample } from "../types/task";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        // Ensure tasks is always an array and conforms to TaskExample structure
        const safeTasks = Array.isArray(data) ? data : data.tasks || [];
        const normalizedTasks = safeTasks.map((t) => ({
          ...TaskExample,
          ...t, // overwrite defaults with actual data
        }));
        setTasks(normalizedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]);
      }
    };
    fetchTasks();
  }, []);

  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const highPriority = tasks.filter((t) => t.priority === "high").length;
  const recent = tasks.slice(-5);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <DarkModeToggle />
      </div>

      {/* Quick Action Buttons */}
      <div className="flex justify-end space-x-2 mb-4">
        <Button onClick={() => navigate("/tasks/new")}>Add Task</Button>
        <Button onClick={() => navigate("/tasks")}>View All</Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>Total Tasks: {total}</Card>
        <Card>Pending: {pending}</Card>
        <Card>In Progress: {inProgress}</Card>
        <Card>Completed: {completed}</Card>
        <Card>High Priority: {highPriority}</Card>
      </div>

      {/* Recent Tasks */}
      <Card className="col-span-1 md:col-span-2">
        <h2 className="font-bold mb-2">Recent Tasks</h2>
        {recent.length > 0 ? (
          <ul className="list-disc list-inside">
            {recent.map((task) => (
              <li key={task._id}>{task.title}</li>
            ))}
          </ul>
        ) : (
          <p>No recent tasks.</p>
        )}
      </Card>
    </div>
  );
}
