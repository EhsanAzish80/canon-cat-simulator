const editor = document.getElementById("editor");
const status = document.getElementById("status-bar");
const cheatSheet = document.getElementById("cheat-sheet");
const cheatToggle = document.getElementById("cheat-toggle");

let leapTerm = "";
let clipText = "";
let lastCursorPos = 0;

// Boot-up effect
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("boot-screen").style.display = "none";
    document.getElementById("screen").style.display = "flex";
    editor.focus();

    // Restore saved content
    const saved = localStorage.getItem("canoncat-text");
    if (saved) {
      editor.innerText = saved;
      setTimeout(() => {
        setCaretIndex(saved.length);
        updateStatus();
      }, 0);
    }
  }, 1500); // Boot delay
});

editor.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "ArrowRight") {
    e.preventDefault();
    leapForward();
  } else if (e.ctrlKey && e.key === "ArrowLeft") {
    e.preventDefault();
    leapBackward();
  } else if (e.ctrlKey && e.key === "d") {
    e.preventDefault();
    document.execCommand("delete");
  } else if (e.ctrlKey && e.key === "c") {
    e.preventDefault();
    clipText = window.getSelection().toString();
    updateStatus();
  } else if (e.ctrlKey && e.key === "v") {
    e.preventDefault();
    document.execCommand("insertText", false, clipText);
  } else if (e.ctrlKey && e.key === "/") {
    e.preventDefault();
    toggleCheatSheet();
  }
});

editor.addEventListener("input", updateStatus);
editor.addEventListener("click", updateStatus);

function leapForward() {
  leapTerm = prompt("LEAP forward to:");
  if (!leapTerm) return;
  const text = editor.innerText;
  const pos = getCaretIndex();
  const next = text.indexOf(leapTerm, pos + 1);
  if (next !== -1) {
    setCaretIndex(next);
  }
  updateStatus();
}

function leapBackward() {
  leapTerm = prompt("LEAP backward to:");
  if (!leapTerm) return;
  const text = editor.innerText;
  const pos = getCaretIndex();
  const prev = text.lastIndexOf(leapTerm, pos - 1);
  if (prev !== -1) {
    setCaretIndex(prev);
  }
  updateStatus();
}

function getCaretIndex() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const preCaret = range.cloneRange();
  preCaret.selectNodeContents(editor);
  preCaret.setEnd(range.endContainer, range.endOffset);
  return preCaret.toString().length;
}

function setCaretIndex(chars) {
  const node = editor.firstChild;
  if (!node) return;
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(node, Math.min(chars, node.length));
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function updateStatus() {
  const cursor = getCaretIndex();
  const lines = clipText.split("\n").length;
  status.textContent = `[LEAP: ${leapTerm}]  [Cursor: ${cursor.toString().padStart(4, "0")}]  [CLIP: ${lines} line${lines > 1 ? "s" : ""}]`;

  // Save to localStorage
  localStorage.setItem("canoncat-text", editor.innerText);
}

// Cheat sheet toggle
cheatToggle.addEventListener("click", toggleCheatSheet);

function toggleCheatSheet() {
  cheatSheet.style.display = cheatSheet.style.display === "none" ? "block" : "none";
}
