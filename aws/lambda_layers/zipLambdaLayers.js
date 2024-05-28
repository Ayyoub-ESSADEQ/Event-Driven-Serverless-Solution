import { zipDirectories } from "../utils/zipDirectories.js";

/**
 * This utility script is used to generate all the zip files of the our  
 * custom layers needed if we want to upload them to lambda layers console.
 */

const baseDir = 'aws/lambda_layers';
const outDir = `aws/dist/lambda_layers`;

zipDirectories(baseDir, outDir);
