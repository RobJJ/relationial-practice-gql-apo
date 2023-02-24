// import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router";
// import { createJob, CREATE_JOB_MUTATION, JOB_QUERY } from "../graphql/queries";
// import { getAccessToken } from "../auth";
import { useCreateJob } from "../graphql/hooks";

function JobForm() {
  const navigate = useNavigate();
  //
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { createJob, loading } = useCreateJob();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // the func returned from useCreateJob hook
    const job = await createJob(title, description);
    // console.log("should post a new job:", { title, description });
    // const companyId = `pVbRRBQtMVw6lUAkj1k43`; // not needed as param as server handles this now!
    // const job = await createJob({ title, description });
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link"
                // can disable the submit button if loading true
                disabled={loading}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;
