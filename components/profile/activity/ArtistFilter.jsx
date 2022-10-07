import React, { useState, useEffect } from "react";
import Select from "react-select";
import { nameOpts, searchResultSet } from "/utils/artistFilterHelpers";

export default function ArtistFilter({ allResults, filteredResults }) {
  const [artistNames, setArtistNames] = useState();
  const [searchNames, setSearchNames] = useState([]);
  const [resultSet, setResultSet] = useState([]);

  useEffect(() => {
    let data = allResults.map((listing) => {
      return { name: listing.artist_name || listing.brand_name };
    });
    setArtistNames(nameOpts(data));
  }, [allResults]);

  useEffect(() => {
    const results = searchResultSet(allResults, searchNames, []);
    setResultSet(results);
  }, [searchNames, allResults]);

  useEffect(() => {
    filteredResults(resultSet);
  }, [resultSet]);

  function onNameSelectChange(opt) {
    setResultSet([]);
    setSearchNames(opt);
  }

  return (
    <>
      <Select
        options={artistNames}
        onChange={onNameSelectChange}
        isMulti
        placeholder="Filter by Artist"
        className="text-black w-full sm:w-[350px] mb-2 float-right"
        classNamePrefix="react-select"
      />
    </>
  );
}
