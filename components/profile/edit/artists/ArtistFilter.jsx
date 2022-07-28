import React, { useState, useEffect } from "react";
import Select from "react-select";
import { nameOpts, searchResultSet } from "/utils/artistFilterHelpers";

export default function ArtistFilter({ following, filteredResults }) {
  const [artistNames, setArtistNames] = useState();
  const [searchNames, setSearchNames] = useState([]);
  const [resultSet, setResultSet] = useState([]);

  useEffect(() => {
    let data = following.map((artist) => {
      return { name: artist.artist };
    });
    setArtistNames(nameOpts(data));
  }, [following]);

  useEffect(() => {
    const results = searchResultSet(following, searchNames, []);
    setResultSet(results);
  }, [searchNames, following]);

  useEffect(() => {
    filteredResults(resultSet);
  }, [resultSet]);

  function onNameSelectChange(opt) {
    setResultSet([]);
    setSearchNames(opt);
  }

  return (
    <Select
      options={artistNames}
      onChange={onNameSelectChange}
      isMulti
      placeholder="Filter by Artist"
      className="text-black w-full sm:w-[350px] mb-2 float-right"
      classNamePrefix="react-select"
    />
  );
}
