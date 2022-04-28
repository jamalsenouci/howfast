# SoFast

Passing judgement on the performance of your dev scripts

A CLI for logging timings of commands. Inspired by esbuild which finishes with a message like this: "⚡ Done in 53ms". SoFast builds on this to include prompts that identify performance issues.

# Philosophy

The ideal development workflow has fast iteration cycles between writing code and executable tasks (e.g. typechecking, compilation, testing). Modern tooling is making it possible to reduce these task times significantly ([esbuild](https://esbuild.github.io/), [vite](https://vitejs.dev/), [nx](https://nx.dev/getting-started/intro)). SoFast just helps you to realise when you have a problem.

SoFast has three judgements:

- duration < 10s: ⚡ SoFast!!! ⚡
- 10s < duration < 120s: 🥱 Not So Fast 🥱
- duration > 120s: 🐌 SoSlow 🐌

The goal is to make sure our scripts don't break our flow.

## Installation

_We recommend to install globally for convenience_

    npm i -g sofast

## Usage

    Usage: sofast <command> [options ...]

### Options

#### **--name=\<commandName\>**

The optional name you can give to label the command. Default is the name of the command

#### **--prefix=\<prefix\>**

The optional prefix with which to execute the command (e.g. npx). Default is pnpm

#### **--help**

Displays the usage guide

## Examples

### Run adhoc via Terminal

#### **With PNPM installed (Recommended)**

[pnpm](https://pnpm.io/) is worthwhile switching to for many reasons but here the benefit is that it will run any script in your package.json or failing that any binary in your path.

    $ sofast build

#### **Without PNPM installed**

    $ sofast --prefix='npm run' 'build'

### Run persistently via package.json

Bear in mind that sofast adds about 1.5s of overhead to every command so you will be trading off performance for knowledge.

    {...
    "scripts": {
        "build": "sofast --name build 'tsc'",
        }
    }
