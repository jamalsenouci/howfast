#! /usr/bin/env node
import process from "node:process";
import pc from "picocolors";
import { execSync } from "node:child_process";
import commandLineArgs from "command-line-args";
import commandLineUsage from 'command-line-usage'

const optionDefinitions = [
  { name: "command", typeLabel: '{underline string}',  description: 'The command to time.', type: String, defaultOption: true },
  { name: "name", typeLabel: '{underline string}', description: 'The optional name to label the command.', type: String },
  { name: "prefix", typeLabel: '{underline string}', description: 'The optional prefix to add to the command (e.g. npx).', type: String },
  { name: "help", alias: "h", description: 'Print this usage guide.', type: Boolean},
];

const b = pc.green;
const m = pc.yellow;
const CLI_TITLE = pc.bold(pc.underline('SoFast'));
const CLI_DESCRIPTION = 'Passing judgement on the performance of your scripts';
const CLI_USAGE = 'Usage: \`sofast <command> [options ...]\`';
const HELP_HEADER = `
    ${m('/˜\\\˜˜/')}
   ${m('/\\\\˜˜/')}
  ${m('/__\\\\/')}${b('__  __')}        ${CLI_TITLE}
 ${m('/\\\\  /')}${b('\\\\  /\\\\  /')}
${m('/__\\\\/__')}${b('\\\\/__\\\\/')}         ${CLI_DESCRIPTION}
       ${b('/\\\\  /')}  
      ${b('/__\\\\/')}                      ${CLI_USAGE}
     ${b('/\\\\  /')}  
    ${b('/__\\\\/')} 

`;

const sections = [
  {
    content: HELP_HEADER,
    raw: true
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  },
  {
    header: 'Examples',
    content: [
      {
        desc: '1. time npm script using pnpm. ',
        example: '$ sofast build'
      },
      {
        desc: '2. custom naming',
        example: '$ sofast --name=typecheck "tsc --noEmit"'
      },
      {
        desc: '3. using custom prefix',
        example: '$ sofast --name=gobuild --command=bash "scripts/build.sh"'
      }
    ]
  },
  {
    content: 'Project home: {underline https://github.com/jamalsenouci/sofast}'
  }
]
const usage = commandLineUsage(sections)


const elapsedTime = (start: bigint): number => {
  const elapsedNano = process.hrtime.bigint() - start;
  const elapsedMillis = Number(elapsedNano / BigInt(1000000));
  const elapsedSeconds = elapsedMillis / 1000;
  // divide by a million to get nano to milli
  return Number(elapsedSeconds);
};
const logMessage = (commandName: string, elapsedSeconds: number) => {
  const precision = 2; // 2decimal places
  const rawMessage = `⚡ ${commandName} done in ${elapsedSeconds.toFixed(
    precision
  )} s`;
  // https://www.nngroup.com/articles/powers-of-10-time-scales-in-ux/
  // less than 10 seconds won't break most people's flow
  if (elapsedSeconds < 10) {
    console.log(pc.green("⚡ SoFast!!! ⚡"));
    console.log(pc.green("🚀 did it even run? 🚀"));
    console.log(pc.green(rawMessage));
    return;
  }
  // up to 2 mins will keep
  if (elapsedSeconds > 10 && elapsedSeconds < 120) {
    console.log(pc.yellow("🐌 NotSoFast 🐌"));
    console.log(pc.yellow("🐌 brb going for a coffee 🐌"));
    console.log(pc.yellow(rawMessage));
  }
  if (elapsedSeconds > 120) {
    console.log(pc.red("🐌 SoSlow 🐌"));
    console.log(pc.red(`🐌 Why was I running ${commandName} again??  🐌`));
    console.log(pc.red(rawMessage));
  }
};

const timeCommand = (command: string, prefix: string): number => {
  const start = process.hrtime.bigint();
  if (prefix !== "npm"){
    execSync(`${prefix} ${command}`, {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
      stdio: "inherit",
    });
  }  else {
    try {
      execSync(`npm run ${command}`, {
        encoding: "utf8",
        maxBuffer: 50 * 1024 * 1024,
        stdio: "inherit",
      });
    } catch{
      try{
        execSync(`npx ${command}`, {
          encoding: "utf8",
          maxBuffer: 50 * 1024 * 1024,
          stdio: "inherit",
        });
      } catch {
        execSync(`${command}`, {
          encoding: "utf8",
          maxBuffer: 50 * 1024 * 1024,
          stdio: "inherit",
        });
      }
    }
  }
  
  const elapsedSeconds = elapsedTime(start);
  return elapsedSeconds;
};

const main = () => {
  // parse command line args
  const options = commandLineArgs(optionDefinitions);
  if (options.help) {
    console.log(usage)
    return
  }
  // validate args
  const valid = options.command;
  if (!valid) {
    console.log(pc.red("you must provide at least one command to time"));
  }
  // set command name
  let commandName: string;
  if (options.name) {
    commandName = options.name;
  } else {
    commandName = options.command;
  }
  // set the prefix to ensure the command is runnable
  let prefix;
  if (options.prefix){
    prefix = options.prefix
  } else {
    prefix = "pnpm"
  }

  // remove overhead of timeCommand
  const baseline = timeCommand(":", "");
  const elapsedSeconds: number =
    timeCommand(options.command, prefix) - baseline;
  logMessage(commandName, elapsedSeconds);
};

main();
