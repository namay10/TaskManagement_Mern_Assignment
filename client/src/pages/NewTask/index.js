import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/utils/api";
import Input from "../../components/common/MUI-themed/Input";
import TextArea from "../../components/common/MUI-themed/TextArea";
import Checkbox from "../../components/common/MUI-themed/Checkbox";

const NewTask = () => {
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const addTask = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/tasks', {
        title,
        description,
        deadline,
        status,
      });
      
      console.log(data);
      navigate("/");
    } catch (e) {
      console.log(e);
      setErrorMsg(e.response.data.msg);
    }
    setLoading(false);
  };

  const handleStatusChange = (e) => {
    console.log(e.target.value, e.target.checked)
    setStatus(e.target.value);
  };

  return (
    <div className="full-page new-task-page p-8 bg-white">
      <div className="xs:py-4 sm:py-8 xs:px-4 sm:px-12">
        <h1 className="mb-2 text-dark font-medium">Add New Task</h1>
        <div className="my-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
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
            <Input
              className="my-5"
              label="Deadline"
              type="date"
              val={deadline}
              setVal={setDeadline}
              required
            />
            <div className="mt-8">
              {errorMsg && (
                <div className="text-red-500 text-end text-sm err-msg">
                  {errorMsg}
                </div>
              )}
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
