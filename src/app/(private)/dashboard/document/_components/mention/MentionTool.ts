import { API, InlineTool } from "@editorjs/editorjs";
import { users, User } from "./users";

export default class MentionTool implements InlineTool {
  static get isInline() {
    return true;
  }

  private api: API;
  private tag: string = "SPAN";
  private className: string = "mention-tag";
  private dropdown: HTMLDivElement | null = null;

  constructor({ api }: { api: API }) {
    this.api = api;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  /** Create mention tag */
  render(): HTMLElement {
    const span = document.createElement(this.tag);
    span.classList.add(this.className);
    span.contentEditable = "false";
    span.dataset.mention = "";
    span.innerText = "@mention";
    return span;
  }

  /** Listen for `@` keypress inside the editor */
  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === "@" && this.api.selection) {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          this.showDropdown(range, "");
        }
      }, 10);
    }
  }

  /** Show dropdown with user suggestions */
  private showDropdown(range: Range, query: string): void {
    this.removeDropdown();

    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredUsers.length === 0) return;

    this.dropdown = document.createElement("div");
    this.dropdown.classList.add("mention-dropdown");

    filteredUsers.forEach((user) => {
      const item = document.createElement("div");
      item.classList.add("mention-item");
      item.innerText = `@${user.name}`;
      item.onclick = () => this.insertMention(range, user);
      this.dropdown!.appendChild(item);
    });

    document.body.appendChild(this.dropdown);

    /** Position dropdown near cursor */
    const rects = range.getClientRects();
    if (rects.length > 0) {
      const rect = rects[0];
      this.dropdown.style.left = `${rect.left + window.scrollX}px`;
      this.dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    }
  }

  /** Insert mention into the editor */
  private insertMention(range: Range, user: User): void {
    this.removeDropdown();

    const span = this.render();
    span.innerText = `@${user.name}`;
    span.dataset.mention = user.id.toString();

    range.deleteContents();
    range.insertNode(span);
    this.api.selection.expandToTag(span);
  }

  /** Remove dropdown if it exists */
  private removeDropdown(): void {
    if (this.dropdown) {
      this.dropdown.remove();
      this.dropdown = null;
    }
  }

  /** Clean up event listener */
  destroy(): void {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  static sanitize = {
    span: {
      class: true, // Allow the mention-tag class
      dataset: true, // Allow dataset attributes (like `data-mention`)
    },
  };

  /** Render saved mention correctly */
  renderInline(data: { id: number; name: string }): HTMLElement {
    const span = document.createElement("span");
    span.classList.add("mention-tag"); // Ensure mention styles are applied
    span.contentEditable = "false"; // Prevent users from editing mention text
    span.dataset.mention = data.id.toString();
    span.innerText = `@${data.name}`;
    return span;
  }

  /** Save mention data in Editor.js output */
  save(span: HTMLElement): { id: number; name: string } {
    return {
      id: Number(span.dataset.mention),
      name: span.innerText.replace("@", ""),
    };
  }
}
