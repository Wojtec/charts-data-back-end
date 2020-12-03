import { Request, Response, NextFunction } from "express";
import fs, { promises as fsPromise } from "fs";
import readline from "readline";

// Interface of log data.
interface Ilog {
  host: string;
  datetime: {
    day: string;
    hour: string;
    minute: string;
    second: string;
  };
  request: {
    method: string;
    url: string;
    protocol: string;
    protocol_version: string;
  };
  response_code: string;
  document_size: string;
}

// Compiler script
export const compiler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Stream data from .txt file.
  const fileStream = await fs.createReadStream("epa-http.txt");
  // Read data line by line from stream.
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Array for objects.
  const logArr: Array<Ilog> = [];
  // Loop for each readline.
  for await (const line of rl) {
    // Regular expression for split data.
    const re = /[[ ":\]]/g;
    // Split data and remove empty string.
    const data = line.split(re).filter((el) => el.length != 0);
    // Split protocol string.
    const protocol = data[7].split("/");
    // Create log object.
    const log: Ilog = {
      host: data[0],
      datetime: {
        day: data[1],
        hour: data[2],
        minute: data[3],
        second: data[4],
      },
      request: {
        method: data[5],
        url: data[6].split("/.").join("/"),
        protocol: protocol[0],
        protocol_version: protocol[1],
      },
      response_code: data[8],
      document_size: data[9] === "-" ? "0" : data[9],
    };
    // Push object to array.
    logArr.push(log);
  }
  // Save the data in json file.
  await storeData(logArr);

  next();
};
// Method for save data.
const storeData = async (data: Array<Ilog>): Promise<void> => {
  // Convert data to string.
  const convertData = JSON.stringify(data);
  // Write data in JSON file.
  await fsPromise.writeFile("./dist/data.json", convertData);
};
