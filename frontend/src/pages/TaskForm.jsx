import { useEffect, useState } from "react";
import { createTask, getTask, updateTask } from "../api/tasks";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
  });

  useEffect(() => {
    if (id) {
      getTask(id).then((data) => setTask(data));
    }
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await updateTask(id, task);
    else await createTask(task);
    navigate("/tasks");
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center items-start">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" name="title" value={task.title} onChange={handleChange} />
          <Input
            label="Description"
            name="description"
            value={task.description}
            onChange={handleChange}
          />
          <Select
            label="Status"
            name="status"
            value={task.status}
            onChange={handleChange}
            options={[
              { value: "pending", label: "Pending" },
              { value: "in_progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <Select
            label="Priority"
            name="priority"
            value={task.priority}
            onChange={handleChange}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
          <Button type="submit">{id ? "Update Task" : "Create Task"}</Button>
        </form>
      </Card>
    </div>
  );
}
