import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../components/utils/api";
import Input from "../../components/common/MUI-themed/Input";
import Checkbox from "../../components/common/MUI-themed/Checkbox";
import TextArea from "../../components/common/MUI-themed/TextArea";
import { set } from "mongoose";

const NewTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [errorMsg, setErrorMsg] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(""); 
  const [task , setTask] = useState({});
  const fetchTask = async () => {
    try {
      const { data } = await api.get(`api/task/${id}`);
      setTask(data);
    } catch (e) {
    }
  };
  console.log(task);
  
  const [status, setStatus] = useState(task.status);
  console.log(status)
  useEffect(() => {
    fetchTask();
  }, [id]);
  const updateTask = async () => {
    setLoadingUpdate(true);
    try {
      const { data } = await api.put(`/api/tasks/${id}`, {
        task: {
          title,
          description,
          deadline,
          status,
        },
      });
      console.log(data);
      navigate("/");
    } catch (e) {
      console.log(e);
      setErrorMsg(e.response.data.msg);
    }
    setLoadingUpdate(false);
  };

  const [loading, setLoading] = useState(true);
  const getTask = async () => {
    try {
      const { data } = await api.get(`api/task/${id}`);
      setTitle(data.title);
      setDescription(data.description);
      setDeadline(data.deadline.split("T")[0]);
      setStatus(data.status);
      setLoading(false);
    } catch (e) {
      alert("Error fetching task");
      navigate("/");
      setLoading(false);
    }
  };
  useEffect(() => {
    getTask();
  }, []);
  
  const handleStatusChange = (e) => {
    console.log(e.target.value, e.target.checked)
    setStatus(e.target.value);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="full-page new-task-page p-8 bg-white">
      <div className="xs:py-4 sm:py-8 xs:px-4 sm:px-12">
        <h1 className="mb-2 text-dark font-medium">Update Task</h1>
        <div className="my-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateTask();
            }}
          >
            <Input
              className="my-5"
              label="Title"
              type="text"
              val={title}
              setVal={setTitle}
              required
            />
            <TextArea
              className="my-5"
              label="Description"
              rows={3}
              val={description}
              setVal={setDescription}
              required
            />
            <Input
              className="my-5"
              label="Deadline"
              type="date"
              val={deadline}
              setVal={setDeadline}
              required
            />
            <div>
              <label className="block mb-2 text-dark font-medium">Status</label>
              <div className="flex items-center gap-4">
                <Checkbox
                  _id="to-do"
                  value="To Do"
                  checked={status === "To Do"}
                  onChange={handleStatusChange}
                  text="To Do"
                />
                <Checkbox
                  _id="pending"
                  value="Pending"
                  checked={status === "Pending"}
                  onChange={handleStatusChange}
                  text="Pending"
                />
                <Checkbox
                  _id="completed"
                  value="Completed"
                  checked={status === "Completed"}
                  onChange={handleStatusChange}
                  text="Completed"
                />
              </div>
            </div>
            <div className="mt-8">
              {errorMsg && (
                <div className="text-red-500 text-end text-sm err-msg">
                  {errorMsg}
                </div>
              )}
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loadingUpdate}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
