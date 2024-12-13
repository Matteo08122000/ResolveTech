import React, { useEffect, useState } from "react";
import { useTable, usePagination } from "react-table";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const UsersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not available");
          throw new Error("Token not available");
        }

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/users`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(
            "Fetch failed with status:",
            response.status,
            response.statusText
          );
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const result = await response.json();

        const filteredUsers = result.users.filter(
          (user) => user.role === "user"
        );
        setData(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchUsers();
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "_id" },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Created At", accessor: "createdAt" },
      { Header: "Role", accessor: "role" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 shadow-md">
        <Header />
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-64 bg-gray-800 text-white hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-grow p-4 md:p-6 overflow-auto">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Users</h1>

          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200 border border-gray-300 text-sm"
            >
              <thead className="bg-gray-100">
                {headerGroups.map((headerGroup, groupIndex) => (
                  <tr
                    {...(headerGroup.getHeaderGroupProps
                      ? headerGroup.getHeaderGroupProps()
                      : {})}
                    key={headerGroup.id || `headerGroup-${groupIndex}`}
                  >
                    {headerGroup.headers.map((column, columnIndex) => (
                      <th
                        {...(column.getHeaderProps
                          ? column.getHeaderProps()
                          : {})}
                        key={column.id || `column-${columnIndex}`}
                        className="px-4 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-700"
                      >
                        {column.render ? column.render("Header") : null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody
                {...getTableBodyProps()}
                className="divide-y divide-gray-200"
              >
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...(row.getRowProps ? row.getRowProps() : {})}
                      key={row?.original?._id || row.id || Math.random()}
                      className="hover:bg-gray-50"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...(cell.getCellProps ? cell.getCellProps() : {})}
                          key={cell.column.id}
                          className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-800"
                        >
                          {cell.render ? cell.render("Cell") : null}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
            <button
              onClick={previousPage}
              disabled={!canPreviousPage}
              className={`px-4 py-2 text-xs md:text-sm font-medium text-white bg-purple-400 hover:bg-purple-500 rounded ${
                !canPreviousPage && "opacity-50 cursor-not-allowed"
              }`}
            >
              Previous
            </button>
            <span className="text-xs md:text-sm">
              Page {pageIndex + 1} of {pageOptions.length}
            </span>
            <button
              onClick={nextPage}
              disabled={!canNextPage}
              className={`px-4 py-2 text-xs md:text-sm font-medium text-white bg-purple-700 hover:bg-purple-900 rounded ${
                !canNextPage && "opacity-50 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
