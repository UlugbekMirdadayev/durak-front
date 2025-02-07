import { useDroppable } from "@dnd-kit/core";
import PropTypes from "prop-types";

export function Droppable({ id, children, style, disabled }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, "--color-primary": isOver ? "red" : "#D9D9D9" }}
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
};

export default Droppable;
