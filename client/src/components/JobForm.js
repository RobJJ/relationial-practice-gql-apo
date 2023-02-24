import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { createJob, CREATE_JOB_MUTATION, JOB_QUERY } from "../graphql/queries";
import { getAccessToken } from "../auth";

function JobForm() {
  const navigate = useNavigate();
  //
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // the useMutation hook is a bit diff to useQuery.. it returns an arr..1st value is a func used to execute the mutation,, the 2nd is the result from the mutation... the useMutation hook doesnt call straight away and load data like the useQuery but rather it preapres the hook to be used when the func mutate is called! Our goal here is to replace the createJob function we wrote..
  const [mutate, result] = useMutation(CREATE_JOB_MUTATION);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // result contains a data property, we destructure
    const {
      data: { job },
    } = await mutate({
      variables: { input: { title, description } },
      context: {
        headers: { Authorization: "Bearer " + getAccessToken() },
      },
      // the update func we wrote earlier
      update: (cache, { data: { job } }) => {
        cache.writeQuery({
          query: JOB_QUERY,
          variables: { id: job.id },
          data: { job },
        });
      },
    });

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
              <button className="button is-link" onClick={handleSubmit}>
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
