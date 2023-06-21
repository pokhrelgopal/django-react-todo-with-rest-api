import { useEffect, useState } from "react";
import axios from "axios";
export default function App() {
  const [task, setTask] = useState([]);
  const [taskName, setTaskName] = useState("");

  useEffect(function () {
    async function getTask() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/task-list/"
        );
        const data = response.data;
        setTask(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getTask();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title: taskName,
      completed: false,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/task-create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      } else {
        const data = await response.json();
        setTask([...task, data]);
        setTaskName("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (id, completed, title) => {
    const updatedTask = {
      id: id,
      title: title,
      completed: !completed,
    };
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/task-update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        }
      );
      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      } else {
        setTask(
          task.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function handleDelete(id) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/task-delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      } else {
        setTask(task.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="container mx-auto flex items-center justify-center">
      <div className="my-24 bg-lessDark p-10 rounded-lg">
        <form action="" className="" method="post" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              type="text"
              name=""
              id=""
              className=" py-2 px-4 outline-0 rounded-full mr-3"
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-light rounded-full  bg-lightGray py-2 px-4">
              Add Task
            </button>
          </div>
        </form>
        <div className="text-light mt-6 text-lg">
          {task.map(function (item) {
            return (
              <div
                key={item.id}
                className="flex justify-between items-center bg-dark p-4 rounded-lg mb-2"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className="mr-2"
                    defaultChecked={item.completed}
                    onChange={() =>
                      handleChange(item.id, item.completed, item.title)
                    }
                  />

                  <p className={`${item.completed ? "line-through" : ""}`}>
                    {item.title}
                  </p>
                </div>
                <div>
                  <button onClick={() => handleDelete(item.id)}>
                    <span className="material-symbols-outlined text-lightRed">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function Error() {
  return (
    <div className="text-center">
      <p className="text-xl">
        Some unforeseen error occured. Please try again later.
      </p>
    </div>
  );
}
