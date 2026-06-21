---
title: How I avoid becoming a stranger in my own codebase
description: Managing the cognitive load of coding with AI assistants, before they manage me.
pubDate: 2026-06-22
---

I've been leaning on AI coding assistants pretty heavily for a while now. Tools like Claude Code and the like can churn out a huge amount of code in an alarmingly short amount of time. This is obviously great in a lot of ways, and the magic of LLMs makes my life infinitely easier day-to-day, if I look past the existential dread of just how capable AI is at a formerly large part of my job.

But it isn't all great. With great power comes great responsibility, and **with great AI adoption comes an overwhelming amount of output to digest, code to review, and (at times) mind-numbing documentation to read.** With the accelerated pace of AI-assisted development and the push towards greater and greater "productivity" gains (Gotta love the "My multi-agent setup made me a 100000X developer. Here's How." threads), it can be so easy to get swept along in the rush and find yourself in unfamiliar territory.

It's never been easier to become a stranger in your own codebase, not quite sure how you got here or what this `OrchestrationInterfaceFactoryImplementerService` is for, but it's way too late to turn back now.

And therein lies the problem. These tools have made writing code almost free. The trouble is that they've also moved the cost somewhere else, onto **reviewing, understanding, and being responsible for its outputs**. If I'm not careful, the work now lands faster than my brain can naturally absorb it, and I can end up lost at sea.

So this is how I try to keep the robots in check, or really, how I try to keep my own cognitive load in check while letting them do their thing. This is entirely my own approach to wrangling AI assistants, I'm definitely not claiming it's the best way to do things, but it's what's working for me at the minute. **I'd love to hear more about your workflow or approach too.**

## Measure Twice, Cut Once

As I learned the hard way when I set about building some fencing for my house and accidentally bought enough wood to fence off the entire estate, **the cheapest place to prevent a mess is before the actual work begins.**

### Check the Spec

Previously, I had been a big proponent of Claude Code's plan mode for any kind of complex task. More recently, I've adopted a more thorough [spec-driven development](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) approach. I use [OpenSpec](https://openspec.dev/) in particular.

Rather than handing over a vague one-liner and hoping for the best, I start by getting an assistant to lay out a plan or a spec first, get it to question my decisions and find missing details, agree on what we're building and how, and only then let it start getting to work. This works for me for a number of reasons:

1. It forces me to **actually think about what I really want to produce in detail, without rushing in and making a mess.**
2. It keeps a record of my decision-making process. It documents why I've made the decisions I have, what the considered alternatives were and why things have been done in a certain way. This makes it easier for me to get back into the headspace of the project when I've taken a break for a while.
3. It gives me something concrete to review the output *against*. Reviewing a diff against an agreed plan is a world away from reviewing it against a vague feeling of whether it looks about right.

### That's the way uh-huh, uh-huh I like it

Beyond planning each task, I also **encode my standards, coding style and preferences once** rather than re-explaining them every five minutes. Most of these tools let you drop in a file of persistent instructions (e.g. Claude Code uses a `CLAUDE.md` at several levels), where you can spell out your conventions, your preferred libraries, the things you never want it to touch, etc. It means the assistant starts inside the guardrails instead of me having to herd it back behind them on every single task.

It's a bit of effort up front to save myself repeating the same frustrated corrections and disappointed sighs later on. Whether or not these coding assistants are great at sticking to these guardrails is a separate matter, but I at least try to keep them in line.

### Keep things small

When I write code, I do my utmost to keep any pull-requests I make small and self-contained, mostly so my team won't shout at me. **These conventional development best-practices apply to AI-assisted development too.**

It's tempting to ask for the whole feature in one go, but a 600-line diff is a diff that's much easier to just rubber-stamp, because reviewing it properly is exhausting and the robot knows I'm tired. With a 40-line change, I can actually read and understand it quickly. Keeping each task narrow keeps the cost of checking it low, and keeps the blast radius small when it inevitably does something daft.

## Stay in the race

Now that my plan/spec is generated it can be so tempting to just let the genie out of the lamp and come back when it's magicked up my code. Personally, I'm just not ready to hand over the reins entirely yet. There's a number of reasons for this, maybe I'm just a control-freak, but mostly **I feel like if I stay engaged in the process then the final outcome is just better.** I can explain things easier, the code makes more sense to me, and I just understand more. So this is how I keep engaged while my coding assistant does the heavy lifting.

### Learn to read

First, and I cannot stress this enough (to myself more than anyone), actually **read the plan**. If you've gone to the trouble of getting the assistant to write a spec, it's a special kind of self-sabotage to then wave it through without reading it thoroughly. The plan is your one chance to catch a bad idea before it becomes a thousand lines of confidently bad code.

Then, I read the diff. Every time. The plan tells you what the assistant **meant** to do, but the diff tells you what it **actually** did, and those two things drift apart far more often than you'd like. This gap between intent and execution is where a lot of gremlins live. An assistant will happily tell you it's made a small, surgical change and then quietly refactor three files you didn't ask it to touch. Personally, I don't even let Claude add or commit files for me. I like having the chance to manually inspect what files it's made changes to before anything gets committed to a branch, it keeps me engaged throughout the process and gives one more touch-point where I can catch anything going off the rails and course-correct.

### Take responsibility

I try to keep a human, me, in the loop on the decisions that actually matter. The assistant is great at the *how*, but I don't outsource the *what* or the *why*. Architecture, trade-offs, anything I'm going to have to live with for the next two years, those are mine. Letting a tool make decisions you'll be maintaining long after the session ends is a quick route to a codebase nobody understands. This obviously applies at the planning stage, but it can also apply throughout the actual implementation stage too. If I see that Claude is about to bolt a whole new library onto the project to save itself five lines, or restructure something that was working fine, that's a decision, not an implementation detail, and it's one I want to make myself. It's probably a cliché at this point to say that **AI is a tool, just like any other**, but that is how I approach it. I'll entrust it with some of the execution, but I won't hand over the decision-making.

And the rule that ties all of this together: **don't commit to what you can't explain**. I may use AI assistants to generate code, but at the end of the day, **it's still my code.** I have to stand-over it, and I have to be able to traverse it and fix it if something goes wrong. Generally, you'll catch the code that doesn't work out of the box. The hidden danger lies in the code that **does** work but that you don't actually understand, quietly accumulating until the codebase stops feeling like yours. This is essentially cognitive debt, and it's every bit as nasty as the technical kind.

## Who watches the watchmen?

At the end of the day, I am only human, after all. There will always be the chance that I miss something or get something wrong (likely a very high chance in my case). This is a problem that pre-dates AI assistants. So wherever I can, I get other machines to do the watching for me.

### Tried and true

I love old-fashioned deterministic checks. Tests, linters, type checkers, formatters, pre-commit hooks. **None of this is new or exciting, but that's kind of the point. Traditional best practices still apply to this new AI-enabled world.** If they're set up correctly, these checks fail loudly and consistently, every single time, without me having to remember to be vigilant. An AI assistant might write a plausible-looking function that quietly breaks an existing test or key feature, and I'd far rather a red CI run tell me that than my users. Good test coverage and a strict linter act as a second line of defence against AI slop. Unlike me, they will never get tired, they will never get overwhelmed with a huge sea of changes and they will never get talked into "accept all" by a smooth-talking AI assistant.

### Stop hitting yourself

It can also be fun to turn your AI coding assistant against itself. At key points throughout the decision-making and implementation process I will prompt my assistant to review its own code or suggestion. But the secret sauce is that I ask it to **review its own work as a panel of grizzled senior engineers who absolutely HATE the current approach.** This forces your assistant to be critical, sometimes too critical, of its own work and offers a fresh perspective. Again, I don't just blindly trust the outcome of this hostile review, but it does often give me some new approaches or changes to consider. This can even be wrapped into its own skill or command to make things that much quicker.

### Sidenote on speed

Just as an aside, the faster these checks run, the less I have to carry in my head between one step and the next. Slow tests and a sluggish pipeline don't just waste time, they force me to hold more state in my own brain while I wait, which is the very thing I'm trying to offload.

## Know when to get your hands dirty

I think another thing to remember is that **not everything needs AI.** Sometimes the change is small or fiddly enough that it's genuinely faster to just write it myself than to explain it, review it, and correct it. Making that call, rather than reflexively reaching for an assistant, keeps me close to my own codebase. It keeps me tuned in to the effort involved in any change, and the current lay of the land.

## Keeping the robots honest

All this being said, I love AI coding assistants, and they've genuinely changed how I work. But loving them and letting them run the place unsupervised are two very different things. For example, I love my dog, Millie, but I'm not going to leave her unsupervised with my dinner on the table (again).

The whole game is making sure that you remain the person in charge of your own codebase, rather than becoming a stranger to the very code you're shipping. And so, these habits are just how I personally try to stay in the loop, instead of buried underneath a mountain of changes. It's my way of keeping the robots honest, and hopefully, keeping myself honest too.