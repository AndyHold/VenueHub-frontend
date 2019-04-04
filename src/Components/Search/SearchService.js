import superAgent from "superagent";
import {endpoint} from "../../Utilities/endpoint";


export async function getCategories () {
  let response = await superAgent.get(endpoint("/categories"));

  return response.body;
}


export async function getVenues(queries) {
  let response = await superAgent.get(endpoint("/venues" + await parseQueries(queries)));

  return response.body;
}


let parseQueries = function (queries) {
  let query = "";
  for (let key in queries) {
    if (queries.hasOwnProperty(key) && queries[key] && key !== "ratings") {
      if (query === "") {
        query += `?${key}=${queries[key]}`
      } else {
        query += `&&${key}=${queries[key]}`
      }
    }
  }
  if (!queries.ratings.notUseCostRating) {
    if (query === "") {
      query += `?maxCostRating=${queries.ratings.maxCostRating}`
    } else {
      query += `&&maxCostRating=${queries.ratings.maxCostRating}`
    }
  }
  if (!queries.ratings.notUseStarRating) {
    if (query === "") {
      query += `?minStarRating=${queries.ratings.minStarRating}`
    } else {
      query += `&&minStarRating=${queries.ratings.minStarRating}`
    }
  }
  return query;
};
