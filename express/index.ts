import { Request } from "express";
import * as fs from "fs";
import express from "express";
const app = express();
const port = 3036;

type DocEntry = {
  title: string;
  description: string;
  breadcrumb: string[];
};

function isArray(obj: any): obj is any[] {
  return Array.isArray(obj);
}

function analyzeDocEntry(obj: any): string {
  // Check title
  if ("title" in obj === false) {
    return "title is missing";
  } else if (typeof obj.title !== "string") {
    return "title is not a string";
  }

  // Check description
  if ("description" in obj === false) {
    return "description is missing";
  } else if (typeof obj.description !== "string") {
    return "description is not a string";
  }

  // Check breadcrumb
  if ("breadcrumb" in obj === false) {
    return "breadcrumb is missing";
  }
  const breadcrumb = obj.breadcrumb;
  if (!isArray(breadcrumb)) {
    return "breadcrumb is not an array";
  }
  for (let index = 0; index < breadcrumb.length; index++) {
    const b = breadcrumb[index];
    if (typeof b !== "string") {
      return `[${index}] element of breadcrumb is not a string`;
    }
  }

  // Empty string means everything ok
  return "";
}

function isDocEntry(obj: any): obj is DocEntry {
  const errorMessage = analyzeDocEntry(obj);
  if (errorMessage === "") {
    return true;
  } else {
    return false;
  }
}

// Use `asserts` to declare it throws. Exception messages are used to detail where things weng wrong.
function assertEntries(
  filename: string,
  arrOfObjs: any
): asserts arrOfObjs is DocEntry[] {
  if (!isArray(arrOfObjs)) {
    throw new Error(`data in file = '${filename}' is not an array`);
  }

  for (let index = 0; index < arrOfObjs.length; index++) {
    const elem = arrOfObjs[index];
    if (!isDocEntry(elem)) {
      const errorMessage = analyzeDocEntry(elem);
      throw new Error(
        `file = '${filename}' has an invalid [${index}] element, ${errorMessage}`
      );
    }
  }
}

function readJson(): DocEntry[] {
  const filename = __dirname + "/data.json";

  // Get JSON from the file
  const jsonString = fs.readFileSync(filename, "utf8");

  // Let the default error handler of express.js to handle exceptions, which results in 500 error
  const entries = JSON.parse(jsonString);
  assertEntries(filename, entries);

  return entries;
}

function queryStringFilter(req: Request): string {
  if (typeof req.query.filter === "string") {
    return req.query.filter;
  } else {
    return "";
  }
}

function filterEntries(entries: DocEntry[], filterWord: string): DocEntry[] {
  return entries.filter((e) => {
    if (filterWord === "") {
      // empty string will actually cause .includes() method to always return true, but be explict here for read-ability
      return true;
    } else {
      return e.title.includes(filterWord) || e.description.includes(filterWord);
    }
  });
}

app.get("/search", async (req, res) => {
  // If an exception is thrown inside readJson(), it will cause the default error handler of express.js to return 500 error
  const entries = readJson();

  // Get query string `?filter=...`
  const filterWord = queryStringFilter(req);

  console.log(`express.js called with filter word = '${filterWord}'`);

  const filteredEntries = filterEntries(entries, filterWord);

  console.log(filteredEntries);
  res.json(filteredEntries);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
