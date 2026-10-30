# Vocabulary

Twenty terms selected from the research report, with plain-language definitions and examples. Personal review has started with RAG, hallucination, tool calling, human-in-the-loop, and fine-tuning. The notes below record the learner's starting understanding and the technical distinctions to learn; they do not imply that every definition or graph annotation has been independently reviewed.

## Personal learning notes

| Term | Starting understanding | Clarification to retain |
| --- | --- | --- |
| RAG | A source or knowledge base that supplies information and helps reduce made-up answers. | RAG is the retrieval-and-generation process, not the database itself; it can reduce unsupported answers but cannot eliminate them. |
| Hallucination | The system invents information and confidently presents an incorrect answer as correct. | This describes a plausible unsupported or incorrect output, without assuming an intention to deceive. |
| Tool calling | Initially associated with calling tools when an event occurs. | The model requests a structured operation; the application validates and executes it, which differs from a generic event handler. |
| Human-in-the-loop | A new term, initially associated with giving people priority or following their instructions. | It means a defined human review, correction, or approval step inside a workflow. |
| Fine-tuning | A new concept with no initial definition. | Further training updates a model's learned parameters using selected examples; it differs from supplying retrieved documents at request time. |

The definitions below incorporate these distinctions. Applying the unfamiliar concepts in a new example is the next learning step. The remaining terms and the graph's implicit interpretations still need learner review.

<a id="llm"></a>

## 1. Large language model (LLM)

A model trained on large amounts of language data to learn patterns that help it generate and interpret text. It can produce a useful answer without having a reliable way to determine whether every statement is true.

Example: drafting a customer response from supplied support articles ([report](research.md#support-p1)).

<a id="token"></a>

## 2. Token

A unit that a model processes, such as part of a word, punctuation, or another encoded piece of input. A word is not always one token; token counts depend on the tokenizer and affect input limits and often usage costs.

Example: a longer code file generally requires more input tokens ([report](research.md#development-p2)).

<a id="context-window"></a>

## 3. Context window

The maximum amount of tokenized information a model can handle in one request, subject to its input and output limits. A conversation or document collection can be larger than this, so the application must select or summarize what to include.

Example: choosing useful passages instead of sending all company documents ([report](research.md#knowledge-p2)).

<a id="prompt"></a>

## 4. Prompt

The instructions and other input provided to a model for a particular task. It can contain a question, examples, documents, and constraints; clear instructions help but do not guarantee a correct result.

Example: specifying runtime and validation requirements for a proposed endpoint ([report](research.md#development-p1)).

<a id="prompt-engineering"></a>

## 5. Prompt engineering

Designing and testing the instructions, examples, and context given to a model to improve its behavior on a task. It changes the input, rather than changing the model's learned parameters.

Example: stating the required error behavior before requesting code ([report](research.md#development-p1)).

<a id="rag"></a>

## 6. Retrieval-augmented generation (RAG)

A way to find relevant information in external sources and give it to a model before it answers. This can help reduce made-up answers and use current or private information, but RAG is the process rather than the information store, and it does not guarantee correctness.

Example: finding relevant support articles before drafting an answer ([report](research.md#support-p1)).

<a id="embedding"></a>

## 7. Embedding

A numerical representation of an item, such as a passage of text, produced by a model. Comparing these representations can help find related content, but similarity does not establish truth or permission to access it.

Example: representing document passages for retrieval ([report](research.md#knowledge-p1)).

<a id="vector-database"></a>

## 8. Vector database

A data system designed to store and search vector representations, often alongside text and metadata. It helps retrieve nearby representations efficiently; it does not generate the final answer itself.

Example: searching passage embeddings before generating an enterprise answer ([report](research.md#knowledge-p1)).

<a id="grounding"></a>

## 9. Grounding

Connecting a generated answer to relevant evidence or other authoritative information. A grounded answer should be supported by that evidence; adding a citation without checking its relevance is not enough.

Example: keeping a delivery explanation consistent with approved policy ([report](research.md#support-p1)).

<a id="hallucination"></a>

## 10. Hallucination

An output in which the model makes up information or confidently presents an unsupported or incorrect statement. It can sound convincing even when it is wrong; calling it a hallucination does not mean that the system intentionally lies.

Example: combining incompatible policies into an invented company rule ([report](research.md#knowledge-p2)).

<a id="prompt-injection"></a>

## 11. Prompt injection

An attempt to make a model follow an attacker's instructions by putting them in user input or material the model reads. Instructions hidden in retrieved content are an indirect attack; authorization must still be enforced outside the model.

Example: an instruction embedded in a PDF that tries to change the analysis task ([report](research.md#documents-p2)).

<a id="guardrails"></a>

## 12. Guardrails

Checks and restrictions around a model application that limit behavior or catch unsuitable inputs and outputs. They can include validation, filtering, restricted tools, and escalation rules; they are not a complete guarantee of safety or correctness.

Example: restricting which customer service operations are available ([report](research.md#support-p2)).

<a id="tool-calling"></a>

## 13. Tool calling

The model requests a tool operation with structured arguments, such as asking an order-status API for an order's current state. The application checks permission and arguments, executes an allowed request, and returns the result; this is different from merely running an event handler.

Example: requesting order status through an authorized API ([report](research.md#support-p2)).

<a id="agent"></a>

## 14. AI agent

A system that uses a model to choose steps toward a task, often requesting tools and using their results to decide what to do next. Its autonomy depends on the surrounding workflow, permissions, and approval rules.

Example: checking order status before responding to a customer ([report](research.md#support-p2)).

<a id="human-in-the-loop"></a>

## 15. Human-in-the-loop

A defined step in a workflow where a person reviews, approves, or corrects the system's work. It is more specific than generally following human instructions: for example, an assistant proposes a refund, but a person must approve it before it is issued.

Example: requiring approval before an assistant issues a refund ([report](research.md#support-p2)).

<a id="evaluation"></a>

## 16. Evaluation

Checking how well an application performs a task using defined examples and criteria. It should measure relevant behavior, including failures, and help detect changes after a model, source, or instruction update.

Example: testing code against independently specified acceptance examples ([report](research.md#development-p2)).

<a id="latency"></a>

## 17. Latency

The time between making a request and receiving a response or a defined part of it. Retrieval, tool execution, network calls, and generation can all contribute; time to the first token differs from time to the complete answer.

Example: keeping support responses responsive during traffic spikes ([report](research.md#support-p2)).

<a id="fine-tuning"></a>

## 18. Fine-tuning

Further training an existing model on selected examples to change its learned parameters and adapt its behavior. For example, approved tutoring dialogues can help adapt teaching style; simply adding documents to a request does not perform fine-tuning.

Example: adapting teaching style using curated tutoring examples ([report](research.md#education-p2)).

<a id="multimodal"></a>

## 19. Multimodal

Able to work with more than one kind of information, such as text and images. An application's supported input and output types depend on the model and surrounding tools, so not every multimodal model supports every format.

Example: using visual information as well as text in a document ([report](research.md#documents-p1)).

<a id="inference"></a>

## 20. Inference

Running a trained model on input to obtain an output. Ordinary inference uses existing learned parameters rather than performing a training update.

Example: generating a code suggestion from a supplied file ([report](research.md#development-p2)).
