import { zipDirectories } from "utils";
/**
 * This utility script is used to generate all the zip files needed
 * if we want to upload them to lambda function console.
 */
const baseDir = 'aws/lambdas';
const outDir = `aws/dist/lambdas`;

zipDirectories(baseDir, outDir);
