import { useDroppable } from "@dnd-kit/core";
import PropTypes from "prop-types";
import { useEffect } from "react";

export function Droppable({ id, children, style, disabled, setActive }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled,
  });

  useEffect(() => {
    if (setActive) {
      setActive(isOver);
    }
  }, [isOver, setActive]);

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, '--color-primary': isOver ? "red" : "#D9D9D9" }}
    >
      {children}
    </div>
  );
}

Droppable.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  setActive: PropTypes.func,
};

export default Droppable;
