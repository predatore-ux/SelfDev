import { test } from "node:test";
import assert from "node:assert/strict";
import { paths } from "../dist/content.js";
import {
  escapeHTML,
  emptyJourney,
  normalizeDraft,
  normalizeNotes,
  readStorage,
  writeStorage,
  upsertNote,
  simulateFeedback,
} from "../dist/state.js";

const note = (overrides = {}) => ({
  id: "note-1",
  path: "steady",
  date: "2026-11-02T12:00:00Z",
  action: "Compare similar tasks",
  evidence: "A repeated pattern",
  ...overrides,
});

test("stored text cannot become executable markup", () => {
  assert.equal(
    escapeHTML("<img src=x onerror=\"alert(1)\"> & 'test'"),
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;test&#39;",
  );
});

test("notes reject unknown paths, prototype keys, unsafe IDs, invalid dates and duplicates", () => {
  const result = normalizeNotes(
    [
      null,
      note(),
      note(),
      note({ id: "x", path: "__proto__" }),
      note({ id: "x", path: "constructor" }),
      note({ id: "<img>" }),
      note({ id: "y", date: "invalid" }),
    ],
    paths,
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "note-1");
});

test("notes coerce only expected fields and bound text lengths", () => {
  const [result] = normalizeNotes(
    [
      note({
        situation: "x".repeat(2000),
        values: { measure: { evil: true } },
        reflection: 42,
        complete: "yes",
      }),
    ],
    paths,
  );
  assert.equal(result.situation.length, 1600);
  assert.equal(result.values.measure, "");
  assert.equal(result.reflection, "");
  assert.equal(result.complete, false);
  assert.deepEqual(normalizeNotes({}, paths), []);
});

test("reload restores a completed draft and simulation settings", () => {
  const draft = {
    ...emptyJourney("language", "Explain my idea"),
    step: 4,
    values: {
      measure: "English",
      other: "Choose B",
      delay: "Ask for a summary",
    },
    understood: true,
    transferred: true,
    action: "Explain",
    evidence: "A shared summary",
    simulation: { strength: 9, delay: 8, noise: 0 },
  };
  assert.deepEqual(normalizeDraft(draft, paths), draft);
});

test("restored drafts cannot skip required steps", () => {
  assert.equal(normalizeDraft({ ...emptyJourney(), step: 4 }, paths).step, 0);
  assert.equal(
    normalizeDraft({ ...emptyJourney("project", "A task"), step: 4 }, paths)
      .step,
    1,
  );
  assert.equal(
    normalizeDraft(
      { ...emptyJourney("project", "A task"), step: 4, understood: true },
      paths,
    ).step,
    2,
  );
  assert.equal(
    normalizeDraft({ path: "__proto__", step: 4 }, paths).path,
    "steady",
  );
});

test("storage handles malformed JSON, denied access and exhausted quota without crashing", () => {
  assert.equal(
    readStorage(
      {
        getItem() {
          return "{";
        },
      },
      "notes",
      [],
    ).ok,
    false,
  );
  assert.equal(readStorage(null, "notes", []).ok, false);
  assert.equal(
    writeStorage(
      {
        setItem() {
          throw new Error("Quota exceeded");
        },
      },
      "notes",
      [],
    ),
    false,
  );
  const memory = new Map();
  const storage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
  };
  assert.equal(writeStorage(storage, "notes", [note()]), true);
  assert.deepEqual(readStorage(storage, "notes", []).value, [note()]);
});

test("saving the same journey updates one note and preserves its reflection", () => {
  const initial = [note({ reflection: "It helped", complete: true })];
  const result = upsertNote(initial, note({ action: "A better step" }));
  assert.equal(result.length, 1);
  assert.equal(result[0].action, "A better step");
  assert.equal(result[0].reflection, "It helped");
  assert.equal(result[0].complete, true);
  assert.equal(initial[0].action, "Compare similar tasks");
});

test("all published paths have complete questions and unique mapping keys", () => {
  for (const path of Object.values(paths)) {
    assert.equal(path.answers.length, 3);
    assert.ok(path.answers[path.correct]);
    assert.ok(path.transferAnswers[path.transferCorrect]);
    assert.equal(new Set(path.fields.map(([key]) => key)).size, 3);
    assert.ok(path.technical && path.limitation && path.right && path.wrong);
  }
});

test("illustrative simulation converges with moderate gain and short delay", () => {
  const result = simulateFeedback({ strength: 3, delay: 2, noise: 0 });
  assert.equal(result.length, 120);
  assert.ok(Math.abs(result.at(-1) - 1) < 0.001);
});

test("strong gain with long delay produces overshooting; all control combinations stay finite", () => {
  assert.ok(
    Math.max(...simulateFeedback({ strength: 9, delay: 8, noise: 1 })) > 1.5,
  );
  for (let strength = 1; strength <= 9; strength++)
    for (let delay = 0; delay <= 8; delay++)
      for (let noise = 0; noise <= 8; noise++) {
        assert.ok(
          simulateFeedback({ strength, delay, noise }).every(Number.isFinite),
        );
      }
});
