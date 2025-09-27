import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../api/tasks";
import Pagination from "../components/ui/Pagination";
import {Select} from "../components/ui/Select";
import {Input} from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks({ page, status, priority, search });
        setTasks(Array.isArray(data) ? data : data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      }
    };
    fetchTasks();
  }, [page, status, priority, search]);

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
          ]}
        />
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={[
            { value: "", label: "All Priority" },
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task._id}>
            <h2 className="font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <p>
              Status: <span className="capitalize">{task.status}</span> | Priority:{" "}
              <span className="capitalize">{task.priority}</span>
            </p>
            <div className="mt-2 space-x-2">
              <a
                href={`/tasks/edit/${task._id}`}
                className="text-blue-600 dark:text-blue-400"
              >
                Edit
              </a>
              <Button
                className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
      </div>
    </div>
  );
}
