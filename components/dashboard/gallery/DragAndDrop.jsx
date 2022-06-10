import Visible from "/components/dashboard/gallery/Visible";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function DragAndDrop({
  tokens,
  moveCard,
  toggleVisibilityOne,
  setTokenAcceptOffers,
  updates,
}) {
  return (
    <DndProvider backend={HTML5Backend} key={updates}>
      <div id="collectibles">
        {Array.isArray(tokens) &&
          tokens.map((token, index) => {
            if (token.visible)
              return (
                <Visible
                  key={token.id}
                  index={index}
                  id={token.id}
                  token={token}
                  moveCard={moveCard}
                  setVisibility={toggleVisibilityOne}
                  setTokenAcceptOffers={setTokenAcceptOffers}
                />
              );
          })}
      </div>
    </DndProvider>
  );
}
