import type { API, InlineTool } from "@editorjs/editorjs";
import { users, type User } from "./users";

export default class MentionTool implements InlineTool {
  static get isInline() {
    return true;
  }

  private api: API;
  private tag = "SPAN";
  private className = "mention-tag";
  private dropdown: HTMLDivElement | null = null;
  private activeIndex = 0;
  private query = "";
  private listeners: {
    type: string;
    handler: EventListenerOrEventListenerObject;
  }[] = [];
  private filteredUsers: User[] = [];

  constructor({ api }: { api: API }) {
    this.api = api;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    // Add event listeners
    this.addListener(document, "keydown", this.handleKeyDown as EventListener);
    this.addListener(document, "input", this.handleInput as EventListener);
    this.addListener(
      document,
      "click",
      this.handleClickOutside as EventListener
    );
  }

  private addListener(
    element: Document | HTMLElement,
    type: string,
    handler: EventListenerOrEventListenerObject
  ): void {
    element.addEventListener(type, handler);
    this.listeners.push({ type, handler });
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
    // Handle dropdown navigation with arrow keys
    if (this.dropdown) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.activeIndex = Math.min(
          this.activeIndex + 1,
          this.filteredUsers.length - 1
        );
        this.highlightActiveItem();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        this.highlightActiveItem();
      } else if (event.key === "Enter" && this.filteredUsers.length > 0) {
        event.preventDefault();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          this.insertMention(range, this.filteredUsers[this.activeIndex]);
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        this.removeDropdown();
      }
      return;
    }

    // Only trigger for @ key
    if (event.key !== "@") return;

    // Make sure we're in the editor
    const editorElement = document.getElementById("editorjs");
    if (!editorElement || !editorElement.contains(event.target as Node)) return;

    // Delay slightly to ensure the @ character is in the DOM
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      this.query = "";
      this.showDropdown(range, this.query);
    }, 10);
  }

  /** Handle input to filter users in dropdown */
  private handleInput(event: Event) {
    if (!this.dropdown) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;

    // Check if we're in a text node
    if (textNode.nodeType !== Node.TEXT_NODE) return;

    const text = textNode.textContent || "";
    const position = range.startOffset;

    // Find the last @ symbol before the cursor
    const lastAtPos = text.substring(0, position).lastIndexOf("@");
    if (lastAtPos === -1) {
      this.removeDropdown();
      return;
    }

    // Extract the query text after the @ symbol
    this.query = text.substring(lastAtPos + 1, position);

    // Update the dropdown with the new query
    this.updateDropdown(range, this.query);
  }

  /** Handle clicks outside the dropdown to close it */
  private handleClickOutside(event: MouseEvent) {
    if (
      this.dropdown &&
      event.target instanceof Node &&
      !this.dropdown.contains(event.target)
    ) {
      this.removeDropdown();
    }
  }

  /** Update dropdown with filtered users based on query */
  private updateDropdown(range: Range, query: string): void {
    this.filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );

    if (this.filteredUsers.length === 0) {
      this.removeDropdown();
      return;
    }

    // Reset active index
    this.activeIndex = 0;

    // Update dropdown content
    if (this.dropdown) {
      this.dropdown.innerHTML = "";
      this.renderDropdownItems();
      this.positionDropdown(range);
    } else {
      this.showDropdown(range, query);
    }
  }

  /** Show dropdown with user suggestions */
  private showDropdown(range: Range, query: string): void {
    this.removeDropdown();

    this.filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );

    if (this.filteredUsers.length === 0) return;

    this.dropdown = document.createElement("div");
    this.dropdown.classList.add("mention-dropdown");
    this.dropdown.setAttribute("role", "listbox");
    this.dropdown.setAttribute("aria-label", "User suggestions");

    this.renderDropdownItems();
    document.body.appendChild(this.dropdown);
    this.positionDropdown(range);
  }

  /** Render dropdown items */
  private renderDropdownItems(): void {
    if (!this.dropdown) return;

    this.filteredUsers.forEach((user, index) => {
      const item = document.createElement("div");
      item.classList.add("mention-item");
      item.setAttribute("role", "option");
      item.setAttribute(
        "aria-selected",
        (index === this.activeIndex).toString()
      );

      // Create avatar element
      const avatar = document.createElement("div");
      avatar.classList.add("mention-avatar");

      // Create initials for avatar
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      avatar.innerText = initials;

      // Create name element
      const name = document.createElement("div");
      name.classList.add("mention-name");
      name.innerText = user.name;

      // Add elements to item
      item.appendChild(avatar);
      item.appendChild(name);

      // Add event listeners with proper binding
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          this.insertMention(range, user);
        }
      });

      item.addEventListener("mouseover", () => {
        this.activeIndex = index;
        this.highlightActiveItem();
      });

      this.dropdown!.appendChild(item);
    });

    this.highlightActiveItem();
  }

  /** Highlight the active item in the dropdown */
  private highlightActiveItem(): void {
    if (!this.dropdown) return;

    const items = this.dropdown.querySelectorAll(".mention-item");
    items.forEach((item, index) => {
      if (index === this.activeIndex) {
        item.classList.add("mention-item-active");
        item.setAttribute("aria-selected", "true");
        // Ensure the active item is visible in the dropdown
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("mention-item-active");
        item.setAttribute("aria-selected", "false");
      }
    });
  }

  /** Position dropdown near cursor */
  private positionDropdown(range: Range): void {
    if (!this.dropdown) return;

    const rects = range.getClientRects();
    if (rects.length > 0) {
      const rect = rects[0];

      // Position dropdown
      this.dropdown.style.position = "absolute";
      this.dropdown.style.left = `${rect.left + window.scrollX}px`;
      this.dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;

      // Ensure dropdown is within viewport
      const dropdownRect = this.dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust horizontal position if needed
      if (dropdownRect.right > viewportWidth) {
        this.dropdown.style.left = `${
          viewportWidth - dropdownRect.width - 10 + window.scrollX
        }px`;
      }

      // Adjust vertical position if needed
      if (dropdownRect.bottom > viewportHeight) {
        this.dropdown.style.top = `${
          rect.top + window.scrollY - dropdownRect.height - 5
        }px`;
      }
    }
  }

  /** Insert mention into the editor */
  private insertMention(range: Range, user: User): void {
    try {
      // Store the current selection
      const selection = window.getSelection();
      if (!selection) return;

      // Find the text node and position
      const textNode = range.startContainer;
      if (textNode.nodeType !== Node.TEXT_NODE) return;

      const text = textNode.textContent || "";
      const position = range.startOffset;

      // Find the last @ symbol before the cursor
      const lastAtPos = text.substring(0, position).lastIndexOf("@");
      if (lastAtPos === -1) return;

      // Create a new range that covers from @ to current cursor position
      const newRange = document.createRange();
      newRange.setStart(textNode, lastAtPos);
      newRange.setEnd(textNode, position);

      // Delete the @query text
      newRange.deleteContents();

      // Create the mention span
      const span = this.render();
      span.innerText = `@${user.name}`;
      span.dataset.mention = user.id.toString();
      span.dataset.userId = user.id.toString();
      span.dataset.userName = user.name;

      // Insert the span
      newRange.insertNode(span);

      // Add a space after the mention
      const space = document.createTextNode(" ");

      // Set selection after the span
      selection.removeAllRanges();
      const spaceRange = document.createRange();
      spaceRange.setStartAfter(span);
      spaceRange.collapse(true);

      // Insert space
      spaceRange.insertNode(space);

      // Move cursor after space
      spaceRange.setStartAfter(space);
      spaceRange.collapse(true);
      selection.addRange(spaceRange);

      // Ensure the editor recognizes the change
      const changeEvent = new Event("input", { bubbles: true });
      this.api.ui.nodes.wrapper.dispatchEvent(changeEvent);

      // Close the dropdown
      this.removeDropdown();
    } catch (error) {
      console.error("Error inserting mention:", error);
      this.removeDropdown();
    }
  }

  /** Remove dropdown if it exists */
  private removeDropdown(): void {
    if (this.dropdown) {
      this.dropdown.remove();
      this.dropdown = null;
    }
  }

  /** Clean up event listeners */
  destroy(): void {
    this.listeners.forEach(({ type, handler }) => {
      document.removeEventListener(type, handler);
    });
    this.listeners = [];
    this.removeDropdown();
  }

  static sanitize = {
    span: {
      class: true,
      dataset: true,
    },
  };

  /** Render saved mention correctly */
  renderInline(data: { id: number; name: string }): HTMLElement {
    const span = document.createElement("span");
    span.classList.add("mention-tag");
    span.contentEditable = "false";
    span.dataset.mention = data.id.toString();
    span.dataset.userId = data.id.toString();
    span.dataset.userName = data.name;
    span.innerText = `@${data.name}`;
    return span;
  }

  /** Save mention data in Editor.js output */
  save(span: HTMLElement): { id: number; name: string } {
    return {
      id: Number(span.dataset.userId || span.dataset.mention || 0),
      name: span.innerText.replace("@", ""),
    };
  }
}
