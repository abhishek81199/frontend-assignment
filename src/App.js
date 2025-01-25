import "./App.css";
import React, { useState, useEffect } from "react";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "none" });
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const projectsWithIds = data.map((project, index) => ({
          ...project,
          originalIndex: index,
        }));
        setProjects(projectsWithIds);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = "none";
      }
    }

    setSortConfig({ key, direction });

    if (direction === "none") {
      fetch(
        "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
      )
        .then((response) => response.json())
        .then((data) => {
          const projectsWithIds = data.map((project, index) => ({
            ...project,
            originalIndex: index,
          }));
          setProjects(projectsWithIds);
        })
        .catch((error) => console.error("Error fetching data:", error));
      return;
    }

    const sortedProjects = [...projects].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setProjects(sortedProjects);
  };

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [1];
    const maxVisiblePages = 4;

    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 2);
    let endPage = Math.min(startPage + maxVisiblePages - 2, totalPages - 1);

    if (endPage - startPage < maxVisiblePages - 2) {
      startPage = Math.max(endPage - (maxVisiblePages - 2), 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProjects = projects.slice(firstIndex, lastIndex);

  return (
    <div className="app-container">
      <h1>Kickstarter Projects</h1>
      <div className="table-container">
        <table className="project-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th
                onClick={() => handleSort("percentage.funded")}
                className="sortable"
              >
                Percentage Funded{" "}
                {sortConfig.key === "percentage.funded"
                  ? sortConfig.direction === "ascending"
                    ? "↑"
                    : sortConfig.direction === "descending"
                    ? "↓"
                    : "↕"
                  : "↕"}
              </th>
              <th
                onClick={() => handleSort("amt.pledged")}
                className="sortable"
              >
                Amount Pledged{" "}
                {sortConfig.key === "amt.pledged"
                  ? sortConfig.direction === "ascending"
                    ? "↑"
                    : sortConfig.direction === "descending"
                    ? "↓"
                    : "↕"
                  : "↕"}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project, index) => (
              <tr key={project.originalIndex}>
                <td>{project.originalIndex}</td>
                <td>{project["percentage.funded"]}%</td>
                <td>${project["amt.pledged"]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="prev"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; Previous
          </button>

          {getPageNumbers().map((pageNumber, index) =>
            typeof pageNumber === "number" ? (
              <button
                key={index}
                className={`page-number ${
                  currentPage === pageNumber ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ) : (
              <span key={index} className="dots">
                {pageNumber}
              </span>
            )
          )}

          <button
            className="next"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
