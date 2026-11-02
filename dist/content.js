export const paths = {
  steady: {
    category: "Everyday decisions",
    skill: "Better judgment",
    title: "Pause before you overcorrect",
    subtitle: "Learn to tell a passing wobble from a pattern worth acting on.",
    time: "5–7 min",
    color: "sage",
    mark: "↝",
    example: "One disappointing result makes me want to change my whole plan.",
    hook: "A small setback. A big reaction.",
    intro:
      "One result can feel like the whole story. But a measurement can shift for several reasons, and earlier changes may still be taking effect. Let’s explore before reacting.",
    question: "A project’s daily results dip once. What can you conclude?",
    answers: [
      "The current approach has failed.",
      "The result changed; its cause is still uncertain.",
      "A bigger intervention will fix it.",
    ],
    correct: 1,
    right:
      "Exactly. An observation tells you what changed, but not necessarily why. Look for other explanations and enough context before deciding.",
    wrong:
      "That goes further than the evidence. A single reading could reflect ordinary variation, a real change, or something else. Which answer leaves room to investigate?",
    mapTitle: "Find the pattern in your situation",
    mapIntro:
      "Use this as a thinking aid, not a formula. Choose a situation where waiting for more information is appropriate.",
    fields: [
      [
        "measure",
        "What result are you watching?",
        "For example: daily project progress",
      ],
      [
        "other",
        "What else could affect that result?",
        "For example: a different workload or an incomplete report",
      ],
      [
        "delay",
        "What previous change might still be taking effect?",
        "For example: a new approach introduced yesterday",
      ],
    ],
    limitation:
      "Waiting is not always the right response. Urgent issues and meaningful warning signs may need action. This example does not provide diet, exercise, or medical advice.",
    actionPrompt: "What will you check before making a bigger change?",
    actionPlaceholder:
      "I’ll compare several observations and check what else changed before deciding…",
    evidencePrompt: "What evidence would make you reconsider?",
    evidencePlaceholder:
      "A consistent pattern, a verified problem, or new information such as…",
    transfer:
      "A team changes strategy after every quiet sales day, although each strategy takes weeks to show results. What familiar pattern might be worth checking?",
    transferAnswers: [
      "They may be reacting before earlier changes become visible.",
      "Daily sales always reveal whether a strategy works.",
      "Every team should wait exactly seven days.",
    ],
    transferCorrect: 0,
    transferFeedback:
      "The useful connection is delayed feedback. It is a possibility to investigate, not proof: customers, execution, and market changes also matter.",
    technical:
      "This draws on feedback control: a system’s output informs its next adjustment. Noise, delay, and response strength can affect stability. The simulator is illustrative; human situations are not validated mathematical copies of it.",
  },
  project: {
    category: "University & work",
    skill: "Clearer collaboration",
    title: "Agree on what “done” means",
    subtitle: "Use a simple idea from engineering to make group work clearer.",
    time: "4–6 min",
    color: "peach",
    mark: "⊞",
    example:
      "Our group assignment feels busy, but we disagree about what we need to deliver.",
    hook: "A shared task needs a shared finish line.",
    intro:
      "Engineers make requirements checkable so different people can build toward the same result. You can use the same idea in a group assignment: turn a vague goal into something everyone can recognize.",
    question: "Which statement gives a group a clearer finish line?",
    answers: [
      "Make the presentation really professional.",
      "Work harder on the research.",
      "Include three supported findings and one recommendation within the assigned time.",
    ],
    correct: 2,
    right:
      "Yes. The group can check this together. It still needs agreement with the assignment brief, but it gives people something concrete to work toward.",
    wrong:
      "The intention makes sense, but different people could interpret it differently. Look for a statement you could check against the finished work.",
    mapTitle: "Make your real task clearer",
    mapIntro:
      "Use your assignment or project as the material. You do not need an extra practice project.",
    fields: [
      [
        "measure",
        "What do you need to deliver?",
        "For example: a presentation comparing two approaches",
      ],
      [
        "other",
        "What must it include or respect?",
        "For example: evidence, the marking criteria, and a ten-minute limit",
      ],
      [
        "delay",
        "What would let everyone agree it is ready?",
        "Write one observable check, rather than “make it good”",
      ],
    ],
    limitation:
      "A checklist cannot capture every quality of good work. Keep room for judgment, creativity, and the requirements of your actual brief.",
    actionPrompt: "What check will you agree with your group?",
    actionPlaceholder: "At our next meeting, we’ll agree whether…",
    evidencePrompt: "How will you know it helped?",
    evidencePlaceholder: "We can each explain what we’re delivering, and…",
    transfer:
      "You are asking AI to help draft an event invitation. What carries over from setting a shared finish line?",
    transferAnswers: [
      "Accept the first polished draft.",
      "State the audience, essential details, and what a suitable result must include.",
      "Write the longest possible prompt.",
    ],
    transferCorrect: 1,
    transferFeedback:
      "Clear criteria help with people and AI. You still need to check the facts and decide whether the result fits the audience.",
    technical:
      "This borrows from requirements engineering: specifying needs, constraints, and acceptance criteria. We are transferring the habit of making expectations checkable, not turning every human goal into a rigid specification.",
  },
  language: {
    category: "Language & communication",
    skill: "Expressing ideas",
    title: "Help your meaning land",
    subtitle:
      "Borrow a communication check from technology for real conversations.",
    time: "4–6 min",
    color: "blue",
    mark: "↔",
    example:
      "I need to explain my part of a group project in English, but I’m not sure people understand.",
    hook: "Saying it is only half the connection.",
    intro:
      "When devices exchange important information, a reply can confirm what arrived. In a conversation, you can gently check shared meaning too. A brief check helps you notice what to explain differently.",
    question:
      "You explain a plan in a language you’re learning. Which reply gives the most evidence that your meaning arrived?",
    answers: [
      "The listener nods.",
      "You repeat exactly the same words, louder.",
      "The listener describes the next step in their own words.",
    ],
    correct: 2,
    right:
      "Yes. Their explanation gives you something to compare with your intended meaning. A nod might mean understanding, politeness, or simply “I’m listening.”",
    wrong:
      "That can happen without shared understanding. Which reply shows what the listener actually took from your explanation?",
    mapTitle: "Build the check into a real conversation",
    mapIntro:
      "Choose something you already need to explain. This path practises clarity and checking meaning; it does not assess grammar or pronunciation.",
    fields: [
      [
        "measure",
        "What do you need to communicate, and in which language?",
        "For example: explain my project recommendation in English",
      ],
      [
        "other",
        "Write the main point in one short sentence.",
        "For example: I suggest option B because it fits our budget.",
      ],
      [
        "delay",
        "How could you check understanding naturally?",
        "For example: “Which next step makes sense to you?”",
      ],
    ],
    limitation:
      "A conversation is not a network protocol. Ask with warmth and respect; avoid making the other person feel tested. Being understood is one part of language ability.",
    actionPrompt: "Write the sentence and check you will use.",
    actionPlaceholder: "I’ll explain… Then I’ll ask…",
    evidencePrompt: "What will show you what to clarify?",
    evidencePlaceholder:
      "If their reply differs from my intended meaning, I’ll…",
    transfer: "You delegate a task at work. How could the same idea help?",
    transferAnswers: [
      "Invite the person to describe the agreed next step.",
      "Assume silence means agreement.",
      "Use more technical words to sound precise.",
    ],
    transferCorrect: 0,
    transferFeedback:
      "A shared summary can expose different interpretations before work begins. Use it collaboratively: “Let’s check we’ve understood each other.”",
    technical:
      "The connection is acknowledgment and feedback in communication systems. Human language adds ambiguity, relationships, culture, and intention, so this is a limited analogy rather than an exact equivalence.",
  },
};
