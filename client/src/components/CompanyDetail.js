import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { companies } from "../fake-data";
import { useCompany } from "../graphql/hooks";
import { getCompany } from "../graphql/queries";
import JobList from "./JobList";

function CompanyDetail() {
  // const [company, setCompany] = useState(null);
  const { companyId } = useParams();
  const { company, loading, error } = useCompany(companyId);

  // useEffect(() => {
  //   getCompany(companyId).then(setCompany);
  // }, [companyId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // const company = companies.find((company) => company.id === companyId);
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h5 className="title is-5">Jobs at {company.name}</h5>
      <JobList jobs={company.jobs}></JobList>
    </div>
  );
}

export default CompanyDetail;
