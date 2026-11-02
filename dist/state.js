export const NOTES_KEY = "selfdev-practice-v1";
export const DRAFT_KEY = "selfdev-draft-v1";

export function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

const text = (value, limit) =>
  typeof value === "string" ? value.slice(0, limit) : "";
const validPath = (value, paths) =>
  typeof value === "string" && Object.hasOwn(paths, value);
const validId = (value) =>
  typeof value === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(value);

export function normalizeNotes(input, paths) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  return input
    .filter((item) => {
      if (
        !item ||
        !validPath(item.path, paths) ||
        !validId(item.id) ||
        seen.has(item.id)
      )
        return false;
      if (!Number.isFinite(Date.parse(item.date))) return false;
      seen.add(item.id);
      return true;
    })
    .map((item) => ({
      id: item.id,
      path: item.path,
      date: item.date,
      situation: text(item.situation, 1600),
      action: text(item.action, 1600),
      evidence: text(item.evidence, 1600),
      reflection: text(item.reflection, 2400),
      complete: item.complete === true,
      values: Object.fromEntries(
        ["measure", "other", "delay"].map((key) => [
          key,
          text(item.values?.[key], 1200),
        ]),
      ),
    }));
}

export function emptyJourney(path = "steady", situation = "") {
  return {
    id: null,
    path,
    situation,
    step: 0,
    values: {},
    understood: false,
    transferred: false,
    action: "",
    evidence: "",
    simulation: { strength: 3, delay: 2, noise: 1 },
  };
}

export function normalizeDraft(value, paths) {
  if (!value || !validPath(value.path, paths)) return emptyJourney();
  const draft = emptyJourney(value.path, text(value.situation, 1600));
  draft.id = validId(value.id) ? value.id : null;
  draft.values = Object.fromEntries(
    ["measure", "other", "delay"].map((key) => [
      key,
      text(value.values?.[key], 1200),
    ]),
  );
  draft.action = text(value.action, 1600);
  draft.evidence = text(value.evidence, 1600);
  draft.understood = value.understood === true;
  draft.transferred = value.transferred === true;
  const requested = Number.isInteger(value.step)
    ? Math.max(0, Math.min(4, value.step))
    : 0;
  // Never restore a later step without the work required to reach it.
  const reachable = !draft.situation.trim()
    ? 0
    : !draft.understood
      ? 1
      : Object.values(draft.values).some((v) => !v.trim())
        ? 2
        : !draft.transferred || !draft.action.trim() || !draft.evidence.trim()
          ? 3
          : 4;
  draft.step = Math.min(requested, reachable);
  for (const [key, min, max] of [
    ["strength", 1, 9],
    ["delay", 0, 8],
    ["noise", 0, 8],
  ]) {
    const number = value.simulation?.[key];
    if (Number.isInteger(number))
      draft.simulation[key] = Math.max(min, Math.min(max, number));
  }
  return draft;
}

export function readStorage(storage, key, fallback) {
  try {
    if (!storage) return { ok: false, value: fallback };
    const raw = storage.getItem(key);
    return { ok: true, value: raw === null ? fallback : JSON.parse(raw) };
  } catch {
    return { ok: false, value: fallback };
  }
}

export function writeStorage(storage, key, value) {
  try {
    if (!storage) return false;
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function upsertNote(notes, note) {
  const previous = notes.find((item) => item.id === note.id);
  return [
    {
      ...note,
      reflection: previous?.reflection || note.reflection || "",
      complete: previous?.complete || false,
    },
    ...notes.filter((item) => item.id !== note.id),
  ];
}

export function simulateFeedback({ strength = 3, delay = 2, noise = 1 }) {
  const history = Array(12).fill(0);
  let value = 0;
  return Array.from({ length: 120 }, (_, time) => {
    const measured =
      history[Math.max(0, history.length - 1 - delay)] +
      Math.sin(time * 2.7) * noise * 0.015;
    value = Math.max(
      -0.3,
      Math.min(2.1, value + strength * 0.035 * (1 - measured)),
    );
    history.push(value);
    return value;
  });
}
