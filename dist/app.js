import { paths } from "./content.js";
import {
  NOTES_KEY,
  DRAFT_KEY,
  escapeHTML,
  emptyJourney,
  normalizeDraft,
  normalizeNotes,
  readStorage,
  writeStorage,
  upsertNote,
  simulateFeedback,
} from "./state.js";
const $ = (selector) => document.querySelector(selector);

let storage;
try {
  storage = window.localStorage;
} catch {
  storage = null;
}
const initialNotes = readStorage(storage, NOTES_KEY, []);
const initialDraft = readStorage(storage, DRAFT_KEY, null);
let saved = normalizeNotes(initialNotes.value, paths);
let storageAvailable = initialNotes.ok && initialDraft.ok;
let journey = normalizeDraft(initialDraft.value?.journey, paths);
let pendingSituation =
  typeof initialDraft.value?.pendingSituation === "string"
    ? initialDraft.value.pendingSituation.slice(0, 1600)
    : "";
let filter = "All ideas";
const icons = {
  steady: `<svg viewBox="0 0 300 137" fill="none" aria-hidden="true"><path d="M30 92H270M30 49H270" stroke="#cad6bd" stroke-dasharray="4 5"/><path d="M28 98C55 98 53 29 80 40S103 108 127 77S145 44 166 59S188 76 207 65S239 64 272 64" stroke="#486d49" stroke-width="2.5"/><circle cx="207" cy="65" r="6" fill="#d5e5b4" stroke="#486d49"/><path d="M233 31H271" stroke="#97ad7c"/><circle cx="241" cy="31" r="4" fill="#486d49"/></svg>`,
  project: `<svg viewBox="0 0 300 137" fill="none" aria-hidden="true"><path d="M94 48H148V90H202M148 48H202" stroke="#b29977" stroke-width="1.5"/><rect x="42" y="29" width="62" height="37" rx="7" fill="#e4cba7" stroke="#b59a73"/><rect x="196" y="29" width="62" height="37" rx="7" fill="#fcf7ed" stroke="#b59a73"/><rect x="196" y="72" width="62" height="37" rx="7" fill="#fcf7ed" stroke="#b59a73"/><path d="M63 48H83M215 48L222 54L235 40M215 91L222 97L235 83" stroke="#8d7355" stroke-width="2"/></svg>`,
  language: `<svg viewBox="0 0 300 137" fill="none" aria-hidden="true"><rect x="50" y="24" width="114" height="58" rx="15" fill="#d1dee0" stroke="#8aa2a6"/><path d="M68 82V97L85 82" fill="#d1dee0" stroke="#8aa2a6"/><rect x="142" y="60" width="109" height="48" rx="14" fill="#f8fbf9" stroke="#8aa2a6"/><path d="M231 108V119L217 108" fill="#f8fbf9" stroke="#8aa2a6"/><path d="M73 44H139M73 57H114M165 79H226M165 91H206" stroke="#698a8f" stroke-width="2" stroke-linecap="round"/></svg>`,
};
function toast(text) {
  $("#toast").textContent = text;
  $("#toast").classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $("#toast").classList.remove("show"), 3200);
}
function updateStorageNotice() {
  $("#storage-notice").hidden = storageAvailable;
}
function saveDraft() {
  const ok = writeStorage(storage, DRAFT_KEY, { journey, pendingSituation });
  storageAvailable = ok && writeStorage(storage, NOTES_KEY, saved);
  updateStorageNotice();
}
function persist() {
  storageAvailable = writeStorage(storage, NOTES_KEY, saved);
  updateStorageNotice();
  if (!storageAvailable)
    toast(
      "Storage is unavailable. Download your notes before closing this page.",
    );
  return storageAvailable;
}
function count() {
  $("#saved-count").textContent = saved.length;
}
function card(key) {
  const p = paths[key];
  return `<article class="idea-card"><div class="card-art ${p.color}">${icons[key]}</div><div class="card-body"><div class="card-meta"><span>${p.skill.toUpperCase()}</span><span>${p.time}</span></div><h3>${p.title}</h3><p>${p.subtitle}</p><button class="card-link" data-start="${key}">Explore this idea <span aria-hidden="true">↗</span></button></div></article>`;
}
function start(key, situation = "") {
  journey = emptyJourney(key, situation);
  saveDraft();
  if (location.hash === "#learn") render();
  else location.hash = "learn";
}
function render() {
  const route = location.hash.slice(1) || "today";
  updateStorageNotice();
  document
    .querySelectorAll("[data-nav]")
    .forEach((a) =>
      a.classList.toggle(
        "active",
        a.dataset.nav === route ||
          (route === "learn" && a.dataset.nav === "today"),
      ),
    );
  count();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.classList.contains("active")) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (route === "learn") renderJourney();
  else if (route === "ideas") renderIdeas();
  else if (route === "saved") renderSaved();
  else renderToday();
  $("#main").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}
function renderToday() {
  $("#main").innerHTML =
    `<div class="greeting"><p>A little curiosity goes a long way.</p><span class="quiet-label">Learn at your own pace</span></div>
  <section class="hero"><div class="hero-copy"><span class="eyebrow">LESS STUDY MODE. MORE REAL LIFE.</span><h1>Your life is full of<br>learning moments.</h1><p>Build useful skills through the things you already do. Let’s find a connection worth making.</p><button class="primary" id="hero-start">Find my starting point <span>→</span></button></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orbit two"></div><div class="orbit three"></div><span class="floating-tag tag-one"><i class="mini-dot"></i>A group project</span><div class="art-center">✳</div><span class="floating-tag tag-two"><i class="mini-dot"></i>A useful connection</span><span class="floating-tag tag-three"><i class="mini-dot"></i>A skill for life</span></div></section>
  ${journey.situation && !journey.id ? `<div class="resume-banner"><div><strong>Your practice is waiting.</strong><p>${escapeHTML(paths[journey.path].title)} · Step ${journey.step + 1} of 5</p></div><a href="#learn" class="secondary">Continue →</a></div>` : ""}<section aria-labelledby="start-heading"><div class="section-heading"><h2 id="start-heading">Start with your everyday.</h2><span>No perfect goals required.</span></div><form class="start-box" id="situation-form"><label for="situation">What are you working on or figuring out?</label><div class="input-row"><textarea id="situation" maxlength="1600" placeholder="A group assignment, a conversation, a decision that feels tricky…" required>${escapeHTML(pendingSituation)}</textarea><button class="primary">Let’s connect <span>→</span></button></div><p class="helper">You’ll choose a guided example to explore. Your text stays in this browser.</p></form></section>
  <section aria-labelledby="ideas-heading"><div class="section-heading"><h2 id="ideas-heading">Small ideas. Wider possibilities.</h2><a href="#ideas" class="help-button">Explore all ideas ↗</a></div><div class="cards">${Object.keys(paths).map(card).join("")}</div></section>
  <div class="bottom-note"><span aria-hidden="true">↗</span><p><strong>You bring the situation. We help you find the learning.</strong><br>No engineering vocabulary needed. Just a moment of curiosity.</p></div>`;
  $("#hero-start").onclick = () => {
    $("#situation").focus();
    $("#situation-form").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  };
  $("#situation-form").onsubmit = (e) => {
    e.preventDefault();
    const value = $("#situation").value.trim();
    if (!value) {
      $("#situation").setCustomValidity(
        "Describe a situation, or explore an example below.",
      );
      $("#situation").reportValidity();
      return;
    }
    pendingSituation = value;
    saveDraft();
    filter = "All ideas";
    location.hash = "ideas";
  };
  $("#situation").oninput = () => {
    $("#situation").setCustomValidity("");
    pendingSituation = $("#situation").value;
    saveDraft();
  };
  bindCards();
}
function bindCards() {
  document.querySelectorAll("[data-start]").forEach(
    (button) =>
      (button.onclick = () => {
        if (journey.situation && !journey.id) {
          $("#replace-draft").showModal();
          $("#confirm-replace").onclick = () => {
            $("#replace-draft").close();
            start(button.dataset.start, pendingSituation);
          };
          return;
        }
        start(button.dataset.start, pendingSituation);
      }),
  );
}
function renderIdeas() {
  const filtered = Object.keys(paths).filter(
    (k) => filter === "All ideas" || paths[k].category === filter,
  );
  $("#main").innerHTML =
    `<div class="page-intro"><span class="eyebrow">EXPLORE IDEAS</span><h1>A fresh way to see<br>what’s in front of you.</h1><p>Borrow a useful idea from another field. Discover it in plain language, then try it in your own world.</p></div>${pendingSituation ? `<div class="callout"><strong>Your starting point</strong><p>${escapeHTML(pendingSituation)}</p><p>Choose the example that feels most relevant. These are curated paths, not AI recommendations.</p><button class="text-button" id="edit-situation">Edit your situation →</button></div>` : ""}<div class="filter-row" role="group" aria-label="Filter ideas">${["All ideas", ...Object.values(paths).map((p) => p.category)].map((f) => `<button data-filter="${escapeHTML(f)}" aria-pressed="${f === filter}" class="${f === filter ? "active" : ""}">${escapeHTML(f)}</button>`).join("")}</div><p class="library-note">Three guided examples to explore in this first version.</p><div class="cards">${filtered.map(card).join("")}</div>`;
  document.querySelectorAll("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        filter = b.dataset.filter;
        renderIdeas();
        document.querySelector('[data-filter][aria-pressed="true"]').focus();
      }),
  );
  if ($("#edit-situation"))
    $("#edit-situation").onclick = () => (location.hash = "today");
  bindCards();
}
function context(p) {
  return `<aside class="context-panel"><span class="eyebrow">YOUR CONNECTION</span><h3>${p.skill}</h3><p>One idea. Your real situation.<br>A small step you can use.</p><p class="context-text">${escapeHTML(journey.situation || p.example)}</p><p class="helper">Guided example · No live AI</p></aside>`;
}
function renderJourney() {
  const p = paths[journey.path];
  const labels = [
    "Your situation",
    "Explore the idea",
    "Make the connection",
    "Try it in real life",
    "Your next step",
  ];
  $("#main").innerHTML =
    `<button class="back" id="back-library">← Explore ideas</button><div class="journey-header"><span class="eyebrow">${p.category.toUpperCase()} · ${p.time}</span><h1>${p.title}</h1><p>${p.subtitle}</p></div><div class="stepper" role="img" aria-label="Step ${journey.step + 1} of 5: ${labels[journey.step]}">${labels.map((_, i) => `<span class="step ${i < journey.step ? "done" : i === journey.step ? "active" : ""}" aria-hidden="true"></span>`).join("")}</div><div class="journey-grid"><section class="work-panel"><span class="eyebrow">0${journey.step + 1} / ${labels[journey.step].toUpperCase()}</span><div id="step-content"></div></section>${context(p)}</div>`;
  $("#back-library").onclick = () => {
    capture();
    location.hash = "ideas";
  };
  if (journey.step === 0) showContext(p);
  if (journey.step === 1) showExplore(p);
  if (journey.step === 2) showMap(p);
  if (journey.step === 3) showAction(p);
  if (journey.step === 4) showComplete(p);
}
function navigation(nextLabel = "Continue", disabled = false) {
  return `<div class="button-row"><button class="secondary" id="previous">← Back</button><button class="primary" id="next" ${disabled ? "disabled" : ""}>${nextLabel} <span>→</span></button></div>`;
}
function bindNavigation(validate) {
  $("#previous").onclick = () => {
    capture();
    journey.step = Math.max(0, journey.step - 1);
    saveDraft();
    render();
  };
  if ($("#next"))
    $("#next").onclick = () => {
      if (validate && !validate()) return;
      capture();
      journey.step++;
      saveDraft();
      render();
    };
}
function capture() {
  if ($("#journey-situation"))
    journey.situation = $("#journey-situation").value.trim();
  document
    .querySelectorAll("[data-field]")
    .forEach((el) => (journey.values[el.dataset.field] = el.value.trim()));
  if ($("#action")) journey.action = $("#action").value.trim();
  if ($("#evidence")) journey.evidence = $("#evidence").value.trim();
}
function requireFields(selectors) {
  for (const selector of selectors) {
    const el = $(selector);
    el.setCustomValidity(el.value.trim() ? "" : "Add a few words to continue.");
    if (!el.reportValidity()) return false;
  }
  return true;
}
function clearValidation() {
  document
    .querySelectorAll("textarea,input")
    .forEach((el) =>
      el.addEventListener("input", () => el.setCustomValidity("")),
    );
}
function showContext(p) {
  $("#step-content").innerHTML =
    `<h2>Let’s start with something real.</h2><p>Use your own situation, or try the example. Keep it small enough to explore right now.</p><div class="form-field"><label for="journey-situation">What’s happening?</label><textarea id="journey-situation" maxlength="1600" required placeholder="${escapeHTML(p.example)}">${escapeHTML(journey.situation)}</textarea></div><button class="text-button" id="use-example">Use the example ↗</button><p class="helper">This prototype follows a curated path. It won’t generate a personalised analysis of your text.</p>${navigation("Explore the idea")}`;
  $("#use-example").onclick = () => {
    $("#journey-situation").value = p.example;
    $("#journey-situation").setCustomValidity("");
    capture();
    saveDraft();
  };
  bindNavigation(() => requireFields(["#journey-situation"]));
  clearValidation();
  $("#previous").onclick = () => {
    capture();
    location.hash = "ideas";
  };
}
function showExplore(p) {
  $("#step-content").innerHTML =
    `<h2>${p.hook}</h2><p>${p.intro}</p>${journey.path === "steady" ? simulator() : `<div class="pair"><div><span>THE IDEA IN ANOTHER FIELD</span>${journey.path === "project" ? "Engineers agree on checkable requirements before building." : "Devices use replies to check whether information arrived."}</div><div><span>THE CONNECTION IN YOUR LIFE</span>${journey.path === "project" ? "Your group agrees on observable signs that the assignment is ready." : "You invite a brief response to check whether your meaning was understood."}</div></div>`}<h3>${p.question}</h3><div class="choices">${p.answers.map((a, i) => `<button aria-pressed="${journey.understood && i === p.correct}" class="choice ${journey.understood && i === p.correct ? "correct" : ""}" data-answer="${i}">${a}</button>`).join("")}</div><div id="answer-feedback" class="feedback" role="status">${journey.understood ? p.right : ""}</div><details class="technical"><summary>Explore the idea behind this</summary><p>${p.technical}</p></details>${navigation("Connect it to my situation", !journey.understood)}`;
  bindNavigation();
  document.querySelectorAll("[data-answer]").forEach(
    (b) =>
      (b.onclick = () => {
        const correct = Number(b.dataset.answer) === p.correct;
        document.querySelectorAll("[data-answer]").forEach((choice) => {
          choice.classList.remove("correct", "incorrect");
          choice.setAttribute("aria-pressed", String(choice === b));
        });
        b.classList.add(correct ? "correct" : "incorrect");
        $("#answer-feedback").textContent = correct ? p.right : p.wrong;
        journey.understood = correct;
        $("#next").disabled = !correct;
        saveDraft();
      }),
  );
  if (journey.path === "steady") bindSimulation();
}
function simulator() {
  return `<div class="callout"><strong>Try a small experiment.</strong><p>What happens if the response gets stronger while the result is delayed? Move the controls and compare.</p></div><svg class="chart" id="sim-chart" viewBox="0 0 500 185" role="img" aria-label="Illustrative feedback simulation"><path d="M25 50H480M25 95H480M25 140H480" stroke="#e4e9dc"/><path d="M25 60H480" stroke="#b6c49f" stroke-dasharray="5 5"/><path id="sim-path" fill="none" stroke="#4c7655" stroke-width="2.5"/></svg><div class="chart-labels"><span>Starting point</span><span>Time →</span></div><div class="legend"><span><i></i>Simulated result</span><span><i class="target"></i>Target</span></div><label class="slider-label" for="strength">Response strength <output id="strength-value">Balanced</output></label><input id="strength" type="range" min="1" max="9" value="${journey.simulation.strength}"><label class="slider-label" for="delay">Response delay <output id="delay-value">Short</output></label><input id="delay" type="range" min="0" max="8" value="${journey.simulation.delay}"><label class="slider-label" for="noise">Measurement noise <output id="noise-value">Low</output></label><input id="noise" type="range" min="0" max="8" value="${journey.simulation.noise}"><p class="helper" id="sim-note" role="status"></p><p class="helper">Illustrative model only. It does not simulate your body, predict outcomes, or set a waiting period.</p>`;
}
function bindSimulation() {
  function draw() {
    const gain = Number($("#strength").value),
      delay = Number($("#delay").value),
      noise = Number($("#noise").value);
    $("#strength-value").textContent =
      gain < 3 ? "Gentle" : gain < 6 ? "Moderate" : "Strong";
    $("#delay-value").textContent =
      delay < 3 ? "Short" : delay < 6 ? "Medium" : "Long";
    $("#noise-value").textContent =
      noise < 3 ? "Low" : noise < 6 ? "Medium" : "High";
    journey.simulation = { strength: gain, delay, noise };
    const points = simulateFeedback(journey.simulation).map(
      (value, t) => `${25 + (t * 455) / 119},${150 - value * 90}`,
    );
    $("#sim-path").setAttribute("d", "M" + points.join("L"));
    $("#sim-note").textContent =
      gain * (delay + 1) > 32
        ? "Here, strong corrections and delayed feedback produce repeated overshooting. Try reducing one control."
        : noise > 4
          ? "Noise makes individual measurements less reliable. Watch the overall movement."
          : "Watch how this setting approaches the target. Now try stronger corrections with a longer delay.";
    $("#sim-chart").setAttribute(
      "aria-label",
      "Illustrative feedback simulation. " + $("#sim-note").textContent,
    );
  }
  ["strength", "delay", "noise"].forEach(
    (id) =>
      ($("#" + id).oninput = () => {
        draw();
        saveDraft();
      }),
  );
  draw();
}
function showMap(p) {
  $("#step-content").innerHTML =
    `<h2>${p.mapTitle}</h2><p>${p.mapIntro}</p>${p.fields.map(([key, label, placeholder]) => `<div class="form-field"><label for="field-${key}">${label}</label><textarea id="field-${key}" data-field="${key}" maxlength="1200" placeholder="${escapeHTML(placeholder)}" required>${escapeHTML(journey.values[key] || "")}</textarea></div>`).join("")}<details class="technical"><summary>Where this connection has limits</summary><p>${p.limitation}</p></details>${navigation("Choose a small step")}`;
  bindNavigation(() => requireFields(p.fields.map(([key]) => "#field-" + key)));
  clearValidation();
}
function showAction(p) {
  $("#step-content").innerHTML =
    `<h2>Make the idea useful.</h2><p>Choose one step within something you already need to do. You decide what fits; the example is a guide.</p><div class="form-field"><label for="action">${p.actionPrompt}</label><textarea id="action" maxlength="1600" required placeholder="${escapeHTML(p.actionPlaceholder)}">${escapeHTML(journey.action)}</textarea></div><div class="form-field"><label for="evidence">${p.evidencePrompt}</label><textarea id="evidence" maxlength="1600" required placeholder="${escapeHTML(p.evidencePlaceholder)}">${escapeHTML(journey.evidence)}</textarea></div><details class="technical"><summary>If you use AI to help</summary><p>Ask for alternative explanations or a critique of your reasoning. Check its claims, decide what fits, and make sure you can explain your choice yourself. This prototype does not call an AI service.</p></details><h3>Could you spot it somewhere else?</h3><p>${p.transfer}</p><div class="choices">${p.transferAnswers.map((a, i) => `<button aria-pressed="${journey.transferred && i === p.transferCorrect}" class="choice ${journey.transferred && i === p.transferCorrect ? "correct" : ""}" data-transfer="${i}">${a}</button>`).join("")}</div><div id="transfer-feedback" class="feedback" role="status">${journey.transferred ? p.transferFeedback : ""}</div>${navigation("Review my next step", !journey.transferred)}`;
  bindNavigation(() => requireFields(["#action", "#evidence"]));
  clearValidation();
  document.querySelectorAll("[data-transfer]").forEach(
    (b) =>
      (b.onclick = () => {
        const good = Number(b.dataset.transfer) === p.transferCorrect;
        document.querySelectorAll("[data-transfer]").forEach((choice) => {
          choice.classList.remove("correct", "incorrect");
          choice.setAttribute("aria-pressed", String(choice === b));
        });
        b.classList.add(good ? "correct" : "incorrect");
        $("#transfer-feedback").textContent = good
          ? p.transferFeedback
          : "Consider which answer uses the same underlying idea without assuming it explains everything.";
        journey.transferred = good;
        $("#next").disabled = !good;
        saveDraft();
      }),
  );
}
function showComplete(p) {
  $("#step-content").innerHTML =
    `<div class="success-icon" aria-hidden="true">↗</div><h2>A useful idea. A real next step.</h2><p>You’ve explored the connection. Trying it—and noticing what happens—is where the learning continues.</p><div class="callout"><strong>My next step</strong><p>${escapeHTML(journey.action)}</p></div><div class="callout"><strong>What I’ll look for</strong><p>${escapeHTML(journey.evidence)}</p></div><p class="helper">Save this note, then return after your activity to record what happened. ${storageAvailable ? "Saved only in this browser." : "Browser storage is unavailable; notes will last only for this visit."}</p><div class="button-row"><button class="secondary" id="previous">← Edit my step</button><button class="primary" id="save-practice">Save my practice <span>↗</span></button></div>`;
  $("#previous").onclick = () => {
    journey.step = 3;
    saveDraft();
    render();
  };
  $("#save-practice").onclick = () => {
    journey.id ||= crypto.randomUUID();
    saved = upsertNote(saved, {
      id: journey.id,
      path: journey.path,
      date: new Date().toISOString(),
      situation: journey.situation,
      values: { ...journey.values },
      action: journey.action,
      evidence: journey.evidence,
      reflection: "",
      complete: false,
    });
    const success = persist();
    pendingSituation = "";
    saveDraft();
    location.hash = "saved";
    if (success) toast("Your next step is saved. Come back after you try it.");
  };
}
function renderSaved() {
  $("#main").innerHTML =
    `<div class="page-intro"><span class="eyebrow">YOUR PRACTICE</span><h1>Ideas grow when<br>you put them to use.</h1><p>Your small steps, useful observations, and connections worth keeping.</p></div><div class="section-heading"><span>${saved.length} saved ${saved.length === 1 ? "practice" : "practices"}</span><button class="secondary" id="export-notes" ${saved.length ? "" : "disabled"}>Download my notes ↓</button></div><p class="library-note">${storageAvailable ? "Notes are stored on this browser only. Clearing browser data removes them." : "Storage is unavailable. Notes are kept only during this visit."}</p>${
      saved.length
        ? saved
            .map((item) => {
              const p = paths[item.path];
              return `<article class="saved-item" data-id="${escapeHTML(item.id)}"><span class="eyebrow">${item.complete ? "REFLECTED" : "READY TO TRY"} · ${new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><h3>${p.title}</h3><details class="technical"><summary>My situation & connection</summary><p>${escapeHTML(item.situation)}</p>${p.fields.map(([key, label]) => `<p><b>${label}</b><br>${escapeHTML((item.values || {})[key] || "")}</p>`).join("")}</details><div class="callout"><strong>My next step</strong><p>${escapeHTML(item.action)}</p></div><p><strong>What I’m looking for</strong><br>${escapeHTML(item.evidence)}</p><label for="reflection-${escapeHTML(item.id)}">After trying it: what happened, and what would you change?</label><textarea id="reflection-${escapeHTML(item.id)}" maxlength="2400" placeholder="What did you notice? What remains uncertain?">${escapeHTML(item.reflection)}</textarea><div class="button-row"><button class="secondary" data-reflect="${escapeHTML(item.id)}">${item.complete ? "Update reflection" : "Save reflection"} ↗</button><button class="text-button" data-remove="${escapeHTML(item.id)}">Remove note</button></div></article>`;
            })
            .join("")
        : `<div class="empty"><span class="eyebrow">A FRESH START</span><h2>Your first connection starts small.</h2><p>Explore an idea and choose a step to try. You can keep your note here and return to reflect afterwards.</p><a href="#ideas" class="primary">Find an idea <span>→</span></a></div>`
    }`;
  $("#export-notes").onclick = downloadNotes;
  document.querySelectorAll("[data-reflect]").forEach(
    (b) =>
      (b.onclick = () => {
        const item = saved.find((i) => i.id === b.dataset.reflect);
        const field = document.getElementById("reflection-" + item.id);
        if (!field.value.trim()) {
          field.setCustomValidity(
            "Add an observation before saving your reflection.",
          );
          field.reportValidity();
          field.oninput = () => field.setCustomValidity("");
          return;
        }
        item.reflection = field.value.trim();
        item.complete = true;
        const success = persist();
        renderSaved();
        document.querySelector(`[data-reflect="${item.id}"]`).focus();
        if (success)
          toast(
            "Reflection saved. Your observations are part of the learning.",
          );
      }),
  );
  document.querySelectorAll("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        const removed = saved.find((i) => i.id === b.dataset.remove);
        saved = saved.filter((i) => i.id !== b.dataset.remove);
        persist();
        count();
        renderSaved();
        toast("Note removed.");
        $("#undo-remove").hidden = false;
        $("#undo-remove").focus();
        $("#undo-remove").onclick = () => {
          saved = [removed, ...saved.filter((i) => i.id !== removed.id)];
          persist();
          renderSaved();
          count();
          $("#undo-remove").hidden = true;
          toast("Note restored.");
        };
      }),
  );
}
$("#about-button").onclick = () => $("#about").showModal();
document
  .querySelectorAll("#about .close, #about .close-about")
  .forEach((b) => (b.onclick = () => $("#about").close()));
function downloadNotes() {
  capture();
  const blob = new Blob(
    [
      JSON.stringify(
        { version: 1, notes: saved, draft: { journey, pendingSituation } },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "selfdev-practice.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelectorAll("[data-close-replace]").forEach(
  (button) =>
    (button.onclick = () => {
      $("#replace-draft").close();
      location.hash = "learn";
    }),
);
$("#retry-storage").onclick = () => {
  saveDraft();
  toast(
    storageAvailable
      ? "Your work is saved in this browser."
      : "Still unable to save. Download your notes before leaving.",
  );
};
$("#download-work").onclick = downloadNotes;
document.addEventListener("input", (event) => {
  if (event.target.id === "situation") return;
  capture();
  if (event.target.matches("[id^=reflection-]")) {
    const item = saved.find(
      (note) => "reflection-" + note.id === event.target.id,
    );
    if (item) item.reflection = event.target.value.slice(0, 2400);
  }
  saveDraft();
});
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (link?.classList.contains("skip-link")) {
    event.preventDefault();
    $("#main").focus();
    return;
  }
  if (link) {
    capture();
    saveDraft();
  }
});
window.addEventListener("pagehide", () => {
  capture();
  saveDraft();
});
window.addEventListener("hashchange", render);
render();
