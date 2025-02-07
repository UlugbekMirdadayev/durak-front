import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";

function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.id,
    });

  const style = {
    transform: CSS.Translate.toString({
      x: transform?.x,
      y: transform?.y,
      scaleX: transform?.scaleX,
      scaleY: transform?.scaleY,
    }),
    transition: isDragging ? "none" : "transform 0.3s ease",
    touchAction: "none", // Предотвращает конфликты с тач-событиями
    cursor: "grab",
    ...props.style,

    // Применяем специальные стили во время перетаскивания
    ...(isDragging
      ? {
          cursor: "grabbing",
          zIndex: 999,
          rotate: "0deg",
        }
      : {}),
  };

  console.log();

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}

Draggable.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default Draggable;
