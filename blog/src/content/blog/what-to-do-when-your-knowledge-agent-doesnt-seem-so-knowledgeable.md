---
title: What to do when your knowledge agent doesn't seem so knowledgeable
description: "\"Apologies for the confusion.\" Why knowledge agents give wrong answers, and how to fix them."
pubDate: 2026-06-14
---

I've worked on a number of knowledge agent projects now. At some point during the development process, when users finally get their hands on their shiny new AI tool to test it, I might hear some variation of the following:

"Oh... uhh... it should know that."

"That's not right, why is it saying that?"

"It should know that, it's on our website."

"That doesn't sound right..."

Much like with humans, sometimes it's hard to know why a knowledge agent does what it does, or what it knows and doesn't know. 

In this context, by knowledge agent, I'm referring to an [LLM](https://en.wikipedia.org/wiki/Large_language_model)-backed system with agency to make decisions on how to answer user queries. This might involve retrieving knowledge from a knowledge base via [Retrieval-Augmented Generation (RAG)](https://en.wikipedia.org/wiki/Retrieval-augmented_generation), making tool calls to obtain useful information from an external system or environment, or some combination of all of the above.

When a knowledge agent I've been working on suddenly doesn't seem so knowledgeable, this is generally how I go about troubleshooting.

## Is the answer actually available?

Step one in the process for me normally involves **figuring out if the information to answer a user's question actually exists somewhere**, and if the knowledge agent has access to it. This information could be buried in a knowledge base, or returned from some external tool call, but it must exist somewhere. **Not just in a customer's head.**

It's a bit like asking me when a family member's birthday is - if I can't open my Calendar app and check, then I have no idea (sorry Mum, I know it's sometime in July).

If the answer doesn't exist somewhere that the agent can pull from, then it's going to either decline to answer, or worse, make something up. 

To fix this, we update the information available to the agent and retest.

If, however, the answer does exist somewhere that the agent should be able to read from, then we move on to step two.

## Why isn't it getting the right context?

So we know that the answer is out there somewhere, lurking in the depths, and the agent has access to it in principle. However, our agent still just can't seem to give the right answer. There are a few usual suspects that could cause this:

Firstly, knowledge bases are usually broken into [chunks](https://dev.to/zilliz/a-guide-to-chunking-strategies-for-retrieval-augmented-generation-rag-nek) before they're indexed. If a piece of information is split across two chunks, e.g. half of the required information in one chunk and the other half in another, then retrieving either one on its own gives the agent half a picture. 
Choosing the correct chunking strategy for your use case is a whole article in itself that I'll not go into here, but **adjusting your chunking approach to use larger or overlapping chunks, chunking semantically or pulling in surrounding context once a match is found**, can help stitch the full picture back together and lead to better answers.

Secondly, even when the right chunk exists, retrieval might simply miss it, like me trying to find my keys anytime I'm late and trying to get out the door. 
With RAG, an agent searches the knowledge base using some representation of the user's query, and pulls back the chunks it thinks are most relevant. But **"most relevant" can be hard to determine.** If a user phrases their question differently to how the source material is written, the right chunk simply may not rank highly enough to make the cut. 
Fixing this usually means giving retrieval a better shot at the match, maybe by **revisiting your embedding model, adding a reranking step, or rewriting the user's query before you search** so it lines up more closely with how the source is actually worded.

Thirdly, maybe the agent just didn't go looking in the first place. With tool-calling agents, retrieval isn't necessarily automatic, **the agent has to decide to make a call and to where.** 
If the agent doesn't recognise that the question needs an external lookup, it'll happily answer from whatever it already has in context, and you'll get a confident, but more than likely wrong answer. 
The issue here normally lives in your tool definitions/descriptions and your prompts. Making it clearer **when and why a tool should be used, and giving the agent permission to admit when it doesn't know**, tends to nudge it towards looking things up rather than guessing.

Finally, maybe the right tool was called, but with the wrong arguments. Even when the agent does reach for a tool, it might query it badly. It could use the wrong filter, wrong date range, or wrong customer ID. This will likely lead to an external system returning nothing, or returning something completely irrelevant. **Tightening up your tool's schema, being more strict about what each argument expects, and giving the agent a few examples of correct usage** all go a long way here.

When trying to untangle any of these causes, **the key is traceability.** When developing agents, I always ensure that I can follow as much of its thinking as possible - what did it retrieve? Did it make any tool calls? What arguments did it use? Normally, if I can lay this out in front of me, I'll be able to figure out roughly where things went sideways.

If the right context did make it into the agent's hands, and it still got the answer wrong, then we're onto step three.

## Why isn't it using the context properly?

This is the fun part, because it looks like everything upstream worked. The answer existed, retrieval found it, everything is queued up for success, and like Gabriel in the 2026 Champions League final, our agent just can't finish the job (sorry gooners).

A handful of things may be going on here:

**There's too much context**, and our agent can't see the forest for the trees. 
It's tempting to think more context is always better, but agents can and do lose track of relevant details buried in a wall of retrieved text. If you stuff twenty chunks into the prompt to be safe, the one that actually mattered can get drowned out by the nineteen that didn't. 
Likewise, if you've had a long conversation with a knowledge agent, and that history/context hasn't been condensed adequately, the knowledge agent's brain may simply be too fried to think straight. 
The fix is usually to be more selective rather than generous here. **Retrieve fewer, higher-quality chunks, and summarise or trim the conversation history** so the signal isn't drowned out by noise.

Another cause may be that the context contradicts itself. If the knowledge base contains two versions of the truth, say an outdated policy and the current one, the agent has no reliable way of knowing which to trust.
It might pick the wrong one, or awkwardly try to reconcile both. This is **less an agent problem and more a knowledge hygiene problem**, but our poor knowledge agent will get the blame. Here we may need to look at the source. We can likely improve our knowledge agent's answers by **pruning stale documents, deduplicating, and making sure there's a single, clear version of the truth** for the agent to find.

The instructions and the context could also be fighting. Sometimes the system prompt tells an agent to behave one way and the retrieved content pulls it another. The agent is left trying to serve two masters and does neither well. 
Untangling this usually means **being explicit in the prompt about what wins when they clash, for example, telling the agent to always defer to the retrieved source material over its own assumptions.**

Maybe it's also just a hard reasoning step. Occasionally the information is all there for an agent, but answering correctly requires it to combine several facts, do a bit of arithmetic, or make an inference. 
Some questions are just harder than others, and a model that nails simple lookups can still trip over multi-step reasoning. 
Giving the agent some room to think can help here. This may involve **encouraging some step-by-step reasoning, breaking the task into smaller pieces, or reaching for a more capable model** when the question genuinely warrants it.

## Turns out it should know that

I suppose the takeaway here is that as an engineer, we aren't entirely at the mercy of the mysterious AI box whenever we don't get the answers that we're looking for from our agents. Like most problems with software, **there's a logical set of steps we can walk through** to try and make our knowledge agents sound a bit smarter. Almost smarterer than me.

