import Item from "./Item";
import { Droppable } from "react-beautiful-dnd";

export default function Column({ col: { list, id }, setTokenAcceptOffers }) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {list.map((token, index) => (
            <Item
              token={token}
              key={token.mint}
              index={index}
              setTokenAcceptOffers={setTokenAcceptOffers}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
