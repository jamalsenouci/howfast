#! /usr/bin/env node
import process from 'node:process';
import pc from "picocolors"
import { execSync } from 'node:child_process';

import commandLineArgs from 'command-line-args'


const elapsed_time = (start: bigint, commandName: string) => {
    var precision = 2; // 32decimal places
    var elapsedNano = process.hrtime.bigint() - start; 
    var elapsedMillis = Number(elapsedNano / BigInt(1000000))
    var elapsedSeconds = elapsedMillis / 1000
    // divide by a million to get nano to milli
    const rawMessage = `⚡ ${commandName} done in' ${elapsedSeconds.toFixed(precision)} s` 
    const message = pc.green(rawMessage)
    console.log(message)
}

const optionDefinitions = [
    { name: 'command', type: String, defaultOption: true },
    { name: 'name', type: String }
  ]
const options = commandLineArgs(optionDefinitions)

const valid = options.command
let commandName: string;
if (options.name) {
  commandName = options.name
} else {
  commandName = options.command
}

if (valid) {
  const start = process.hrtime.bigint();
  execSync(`pnpm ${options.command}`,{ encoding: 'utf8', maxBuffer: 50 * 1024 * 1024, stdio: "inherit" });
  
  elapsed_time(start, commandName);
} else {
  console.log(pc.red("you must provide at least one command to time"))
}