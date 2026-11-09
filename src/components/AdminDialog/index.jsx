import { useEffect, useRef } from "react";

export default function AdminDialog({ children, onClick, ...props }) {
  const ref = useRef(null);
  const close = useRef(onClick);
  useEffect(() => {
    close.current = onClick;
  }, [onClick]);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    const controls = () => [
      ...dialog.querySelectorAll(
        "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]",
      ),
    ];
    (controls()[0] || dialog).focus();
    const keydown = (event) => {
      if (event.key === "Escape" && !dialog.querySelector("button:disabled")) {
        event.preventDefault();
        close.current?.(event);
      }
      if (event.key !== "Tab") return;
      const items = controls();
      const first = items[0],
        last = items.at(-1);
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("keydown", keydown);
    return () => {
      dialog.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, []);
  return (
    <div
      {...props}
      ref={ref}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
