"use server";

export type DocEntry = {
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
function assertEntries(arrOfObjs: any): asserts arrOfObjs is DocEntry[] {
  if (!isArray(arrOfObjs)) {
    throw new Error(`data from API is not an array`);
  }

  for (let index = 0; index < arrOfObjs.length; index++) {
    const elem = arrOfObjs[index];
    if (!isDocEntry(elem)) {
      const errorMessage = analyzeDocEntry(elem);
      throw new Error(
        `data from API has an invalid [${index}] element, ${errorMessage}`
      );
    }
  }
}

export async function searchServerAction(
  filterWord: string
): Promise<DocEntry[]> {
  const res = await fetch(
    `http://localhost:3036/search?filter=${encodeURIComponent(filterWord)}`
  );

  let jsonData: any;
  try {
    jsonData = await res.json();
  } catch (jsonError) {
    throw new Error(`Response from API cannot be parsed to JSON, ${jsonError}`);
  }

  assertEntries(jsonData);

  return jsonData;
}
