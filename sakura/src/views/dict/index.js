import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import Dictionaries from "./Dictionaries";
import SearchBox from "./SearchBox";
import Definitions from "./Definitions";

function DictView() {
  const [dicts, setDicts] = useState([]);
  const [searchLoading, setSearchLoading] = useState();
  const [searchResult, setSearchResult] = useState({});

  const { dictname } = useParams();

  return (
    <>
      <div className="mt-3"></div>
      <SearchBox
        currentDict={dictname}
        dicts={dicts}
        searchResult={searchResult}
        setSearchResult={setSearchResult}
        setSearchLoading={setSearchLoading}
      />
      <Dictionaries
        currentDict={dictname}
        dicts={dicts}
        setDicts={setDicts}
        searchResult={searchResult}
      />
      <main className="mt-3">
        <Definitions
          dict={dictname}
          searchResult={searchResult}
          searchLoading={searchLoading}
        />
      </main>
    </>
  );
}

export default DictView;
