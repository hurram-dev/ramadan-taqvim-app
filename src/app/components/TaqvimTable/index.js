"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import useFilter from "@/hooks/useFilter";
import { getComputedTime, getWeekdayAndMonth } from "@/utils/taqvimTableUtils";

export default function TaqvimTable() {
  const { data, isLoading } = useSWR("/api/taqvim", fetcher);
  const { onFilterByRegionSelected, filter, filterRegions } = useFilter();

  const [isChecked, setIsChecked] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localStorageData = localStorage.getItem("checkboxData");

      setIsChecked(localStorageData ? JSON.parse(localStorageData) : {});
    }
  }, []);

  const handleCheckboxChange = (entryId) => {
    setIsChecked((prevState) => ({
      ...prevState,
      [entryId]: !prevState[entryId],
    }));

    localStorage.setItem(
      "checkboxData",
      JSON.stringify({
        ...isChecked,
        [entryId]: !isChecked[entryId],
      })
    );
  };

  return (
    <div className="w-full overflow-auto">
      <select
        onChange={onFilterByRegionSelected}
        defaultValue={0}
        className="form-select lg:w-44 w-[90%] mb-3 mx-2
            py-1.5 text-base font-normal text-gray-700 bg-white
            border border-solid border-gray-300 rounded"
        aria-label="Filter by Region"
      >
        {filterRegions.map((region, index) => (
          <option key={index} value={region.id}>
            {region?.name}
          </option>
        ))}
      </select>
      <table className="overflow-x-scroll text-sm text-left text-gray-500 table-auto md:w-full dark:text-gray-400 md:overflow-auto">
        <thead className="text-xs text-white uppercase bg-green-700 dark:bg-green-600">
          <tr>
            <th scope="col" className="px-4 py-2 lg:px-6 lg:py-3">
              Kun
            </th>
            <th scope="col" className="py-2 lg:py-3">
              {"  "}
            </th>
            <th scope="col" className="px-4 py-2 lg:px-6 lg:py-3">
              Hafta Kunlari
            </th>
            <th scope="col" className="px-4 py-2 lg:px-6 lg:py-3">
              Mart/Aprel
            </th>
            <th scope="col" className="px-4 py-2 lg:px-6 lg:py-3">
              Saharlik Vaqti
            </th>
            <th scope="col" className="px-4 py-2 lg:px-6 lg:py-3">
              Iftor Vaqti
            </th>
          </tr>
        </thead>
        <tbody className="h-[40rem] overflow-scroll">
          {!isLoading
            ? data.map((entry, index) => (
                <tr key={index} className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 lg:px-6 lg:py-4 whitespace-nowrap"
                  >
                    {entry?.id}
                  </th>
                  <td className="px-0 py-3 text-2xl font-semibold lg:py-4">
                    <div className="flex items-center justify-start">
                      <label>
                        <input
                          type="checkbox"
                          checked={isChecked[entry.id] || false}
                          onChange={() => handleCheckboxChange(entry.id)}
                          className="w-4 h-4 p-4 mr-2 bg-white border-2 rounded sm:h-5 sm:w-5 accent-green-700"
                        />
                      </label>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-lg lg:px-6 lg:py-4">
                    {getWeekdayAndMonth(entry?.date)?.weekday}
                  </td>

                  <td className="px-4 py-3 text-lg lg:px-6 lg:py-4">
                    {`${getWeekdayAndMonth(entry?.date)?.day} ${
                      getWeekdayAndMonth(entry?.date)?.month
                    }`}
                  </td>
                  <td className="px-4 py-3 text-2xl font-semibold lg:px-6 lg:py-4">
                    {getComputedTime(
                      entry?.date,
                      filter,
                      entry?.time?.morning,
                      "MORNING"
                    )}
                  </td>
                  <td className="px-4 py-3 text-2xl font-semibold lg:px-6 lg:py-4">
                    {getComputedTime(
                      entry?.date,
                      filter,
                      entry?.time?.evening,
                      "EVENING"
                    )}
                  </td>

                  <div></div>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
