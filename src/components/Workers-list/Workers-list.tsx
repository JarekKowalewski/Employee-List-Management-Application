import React, { useContext, useEffect, useState } from "react";
import {  WorkersListContext} from "../../context/WorkersListContext";
import {Workers, WorkersContextType} from '../../types/index'
import "./Workers-list.scss";
import UniversalButton from "../UniversalButton/UniversalButton";

const WorkersList: React.FC = () => {
  const workersContext = useContext<WorkersContextType | undefined>(
    WorkersListContext
  );
  const [searchText, setSearchText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorker, setEditedWorker] = useState<Workers | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<Workers | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Workers | null>(null);
  const [token, setToken] = useState<string | null>(null);
  

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  const isDisabled =
    !workersContext ||
    workersContext.pageNumber >= (workersContext.maxPage || 1);

  const handleDetailsClick = (worker: Workers) => {
    setSelectedWorker(worker);
    setEditedWorker({ ...worker });
  };

  const handleCloseDetails = () => {
    setSelectedWorker(null);
  };


  const handleDelete = (worker: Workers) => {
    setWorkerToDelete(worker);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (workerToDelete && workersContext) {
      workersContext.deleteWorker(workerToDelete.id);
      setIsEditing(false);
      setEditedWorker(null);
      setShowDeleteAlert(false);
    }
  };

  const handleLoadMore = () => {
    if (workersContext && workersContext.pageNumber < workersContext.maxPage) {
      workersContext.setPageNumber(workersContext.pageNumber + 1);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showSuccessAlert) {
      timeoutId = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [showSuccessAlert]);

  const renderField =
    (worker: Workers, field: keyof Workers) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isEditingField =
        isEditing && editedWorker && editedWorker.id === worker.id;

      if (isEditingField && editedWorker) {
        setEditedWorker({ ...editedWorker, [field]: event.target.value });
      }
    };

  const filteredWorkers = workersContext?.workers.filter(
    (worker) =>
      worker.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      worker.lastName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="FindWorkers bg-gray-200 p-4">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold mb-4">Find Workers</h1>
        {token && ( 
          <UniversalButton
            type="link"
            action="/add-worker"
            title="Add worker"
            classes="bg-green-600 text-white px-3 py-1 mt-0 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          />
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={searchText ? "" : "Search for a worker..."}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded p-2 w-full"
        />
        {searchText && (
          <p className="text-center mt-2">Searching for workers...</p>
        )}
      </div>
      <div className="WorkersList">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4 text-center">#</th>
                <th className="py-2 px-4 text-center">Name</th>
                <th className="py-2 px-4 text-center">Surname</th>
                <th className="py-2 px-4 text-center">Salary</th>
                <th className="py-2 px-4 text-center">Status</th>
                <th className="py-2 px-4 text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers?.map((worker) => (
                <tr key={worker.id}>
                  <td className="py-2 px-4 text-center">{worker.id}</td>
                  <td className="py-2 px-4 text-center">{worker.firstName}</td>
                  <td className="py-2 px-4 text-center">{worker.lastName}</td>
                  <td className="py-2 px-4 text-center">{worker.salary} zł</td>
                  <td className="py-2 px-4 text-center">
                    {worker.statusOfWork}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {token && (
                      
                      <UniversalButton
                      type="button"
                      action={() => handleDetailsClick(worker)}
                      title="Details"
                      classes="bg-blue-500 text-white py-2 px-4 rounded"
                      />
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <UniversalButton
            type="button"
            action={handleLoadMore}
            title={isDisabled ? "No more data" : "Load more..."}
            classes="bg-blue-500 mt-5 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            isDisabled={isDisabled}
          />
        </div>

        {/* MODAL WINDOW  */}

        {selectedWorker && (
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              &#8203;
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-gray-800 text-white px-4 py-2">
                  <h3 className="text-lg font-medium">Details of worker</h3>
                </div>
                <div className="px-4 py-4">
                  <div className="flex flex-col items-start">
                    <table className="datails-of-worker">
                      <tbody>
                        <tr>
                          <td>ID:</td>
                          <td>{selectedWorker.id}</td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="input-name">Name:</label>
                          </td>
                          <td>
                            <input
                              id="input-name"
                              type="text"
                              value={editedWorker ? editedWorker.firstName : ""}
                              onChange={renderField(
                                selectedWorker,
                                "firstName"
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="sureName">Sure name:</label>
                          </td>
                          <td>
                            <input
                              id="sureName"
                              type="text"
                              value={editedWorker ? editedWorker.lastName : ""}
                              onChange={renderField(selectedWorker, "lastName")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="DateOfBirth">Date of birth:</label>
                          </td>
                          <td>
                            <input
                              id="DateOfBirth"
                              type="text"
                              value={
                                editedWorker ? editedWorker.dateOfBirth : ""
                              }
                              onChange={renderField(
                                selectedWorker,
                                "dateOfBirth"
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="street">Street:</label>
                          </td>
                          <td>
                            <input
                              id="street"
                              type="text"
                              value={editedWorker ? editedWorker.street : ""}
                              onChange={renderField(selectedWorker, "street")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="city">City:</label>
                          </td>
                          <td>
                            <input
                              id="city"
                              type="text"
                              value={editedWorker ? editedWorker.city : ""}
                              onChange={renderField(selectedWorker, "city")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="postCode">Post code:</label>
                          </td>
                          <td>
                            <input
                              id="postCode"
                              type="text"
                              value={editedWorker ? editedWorker.postCode : ""}
                              onChange={renderField(selectedWorker, "postCode")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="salary">Salary:</label>
                          </td>
                          <td>
                            <input
                              id="salary"
                              type="text"
                              value={
                                editedWorker ? `${editedWorker.salary}` : ""
                              }
                              onChange={renderField(selectedWorker, "salary")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="statusOfWork">
                              Status of work:
                            </label>
                          </td>
                          <td>
                            <input
                              id="statusOfWork"
                              type="text"
                              value={
                                editedWorker ? editedWorker.statusOfWork : ""
                              }
                              onChange={renderField(
                                selectedWorker,
                                "statusOfWork"
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="phone">Phone:</label>
                          </td>
                          <td>
                            <input
                              id="phone"
                              type="text"
                              value={editedWorker ? editedWorker.phone : ""}
                              onChange={renderField(selectedWorker, "phone")}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* <UniversalButton
                      type="button"
                      action={handleEditSave}
                      title={isEditing ? "Save" : "Edit"}
                      classes={`mr-2 ${
                        isEditing ? "bg-blue-500" : "bg-green-500"
                      } text-white py-1 px-2 rounded-md`}
                    /> */}

                    <UniversalButton
                      type="button"
                      action={() => handleDelete(selectedWorker)}
                      title="Delete"
                      classes="bg-red-500 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    />
                  </div>
                </div>
                <div className="bg-gray-800 text-center py-2">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={handleCloseDetails}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* THE END OF MODAL WINDOW  */}
      </div>

      {showSuccessAlert && (
        <div className="bg-green-500 text-white p-4 mb-4 rounded-md">
          Data updated successfully!
        </div>
      )}
      {showDeleteAlert && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
          <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
            <p className="mb-2">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="text-white bg-green-500 py-1 px-2 rounded-full mr-2"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="text-white bg-red-500 py-1 px-2 rounded-full"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersList;