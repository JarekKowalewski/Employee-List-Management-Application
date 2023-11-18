import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./WorkersList.scss";
import {
  WorkersListContext,
  WorkersContextType,
} from "../../context/WorkersListContext";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export const WorkersList = () => {
  const workersContext = useContext<WorkersContextType | undefined>(
    WorkersListContext
  );
  const navigate = useNavigate();

  if (!workersContext) {
    return <div>Loading...</div>;
  }

  const { workers } = workersContext;

  const handleAddWorkerClick = () => {
    navigate("/add-worker"); // Przejdź do strony dodawania pracownika
  };

  return (
    <div>
      <Button variant="primary" type="button" onClick={handleAddWorkerClick}>
        Add Worker
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Street</th>
            <th>City</th>
            <th>Post Code</th>
            <th>Salary</th>
            <th>Status of Work</th>
            <th>Phone</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.firstName}</td>
              <td>{worker.lastName}</td>
              <td>{worker.dateOfBirth}</td>
              <td>{worker.street}</td>
              <td>{worker.city}</td>
              <td>{worker.postCode}</td>
              <td>{worker.salary} zł</td>
              <td>{worker.statusOfWork}</td>
              <td>{worker.phone}</td>
              <td>
                <Button variant="danger" type="button">
                  DELETE
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
