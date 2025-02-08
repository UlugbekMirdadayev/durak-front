import { useDroppable } from "@dnd-kit/core";
import PropTypes from "prop-types";

export function Droppable({ id, children, style, disabled, isDragging }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        "--color-primary": isDragging
          ? isOver
            ? "#f50"
            : "#D9D9D9"
          : "transparent",
        filter: isOver ? "drop-shadow(0 0 5px #000)" : "none",
      }}
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
  isDragging: PropTypes.bool,
};

export default Droppable;
