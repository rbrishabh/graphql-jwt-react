import React from "react";
import { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useDebouncedEffect } from "../CustomHook/useDebouncedEffect";
import {
  useMeQuery,
  useSearchCountryMutation,
  useSearchDataMutation,
} from "../generated/graphql";

import Layout from "./Layout";
import "./style.css";

const Search: React.FC<RouteComponentProps> = ({ history }) => {
  const { data, loading: load } = useMeQuery();

  if (!load && (!data || !data.me)) {
    history.push("/login");
  }

  const [search, setSearch] = useState("");
  const [inputCurrency, setInputCurrency] = useState(1);
  const [conversion, setCurrencyConverstion] = useState<{
    name?: string;
    rate?: number;
  }>({});
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);

  const [response, setResponse] = useState<
    {
      name: string;
      alpha3Code: string;
    }[]
  >();

  const getCountry = async (code: string) => {
    setLoading(true);
    setResponse([]);
    setSearch("");
    let response = await searchData({
      variables: {
        countryCode: code,
      },
    });
    if (response && response.data?.searchData.name) {
      if (!countries.find((c) => c.name === response.data?.searchData.name)) {
        setCountries((countries) => {
          return [...countries, response.data?.searchData];
        });
      }
    }
    setLoading(false);
  };

  const [searchCountry] = useSearchCountryMutation();
  const [searchData] = useSearchDataMutation();

  useDebouncedEffect(
    () => {
      if (search.length < 2) {
        return;
      }
      const searchFn = async () => {
        let response = await searchCountry({
          variables: {
            searchQuery: search,
          },
        });
        setResponse(response.data?.searchCountry);
      };
      searchFn();
    },
    [search, searchCountry],
    100
  );

  return (
    <Layout>
      <div className="search-container">
        <div className="conversion-area">
          <div>
            Convert SEK to {conversion.name ? conversion.name : "SEK"} |
            <input
              onChange={(e) => setInputCurrency(+e.target.value)}
              placeholder="Amount in SEK"
              type="text"
              className="conversion-input"
              value={inputCurrency}
            />{" "}
            SEK ={" "}
            {conversion.rate
              ? (conversion.rate * inputCurrency).toFixed(2)
              : inputCurrency}{" "}
            {conversion.name}
          </div>
        </div>
        <input
          className="input search-input"
          placeholder="Type Country..."
          type="text"
          autoComplete="off"
          name="country"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="search-result-wrapper">
          {response && response.length
            ? response.map((res) => (
                <div
                  className="search-result"
                  onClick={() => getCountry(res.alpha3Code)}
                  key={res.alpha3Code}
                >
                  {res.name}
                </div>
              ))
            : null}
        </div>
        <div className="final-search-results">
          {countries && countries.length
            ? countries.map((res) => (
                <div className="final-search-result" key={res.alpha3Code}>
                  <div className="result-item">
                    <div> Name: {res.name} </div>
                    <div> Population: {res.population}</div>
                    <div className="currency">
                      {res.currencies.map((cur: any, index: number) => (
                        <div key={cur.code}>
                          {" "}
                          Currency {index + 1}: {cur.name} | Exchange Rate to
                          SEK: {cur.exchangeRateToSEK}{" "}
                          <input
                            type="button"
                            className="convert-button-style"
                            value="Convert"
                            onClick={() =>
                              setCurrencyConverstion({
                                name: cur.name,
                                rate: cur.exchangeRateFromSEK,
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* <input value=/> */}
                </div>
              ))
            : null}
        </div>
        {loading && <div>Loading...</div>}
      </div>
    </Layout>
  );
};
export default Search;
