import {
  Button,
  Card,
  Classes,
  Dialog,
  Elevation,
  Icon,
  Intent,
  MenuItem,
  ButtonGroup,
  Tooltip,
} from "@blueprintjs/core";
import { IItemRendererProps, ItemPredicate, MultiSelect } from "@blueprintjs/select";
import React, { useCallback, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { countries } from "./countries";

function App() {
  const [showReorder, setShowReorder] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reorderedSelectedItems, setReorderedSelectedItems] = useState<string[]>([]);

  const handleOpenReorder = useCallback(() => {
    setReorderedSelectedItems([...selectedItems]);
    setShowReorder(true);
  }, [setShowReorder, selectedItems]);

  const handleCloseReorder = useCallback(
    (applyNewOrder: boolean) => {
      if (applyNewOrder) {
        setSelectedItems([...reorderedSelectedItems]);
      }
      setShowReorder(false);
    },
    [setShowReorder, reorderedSelectedItems]
  );

  const selectItem = useCallback(
    (item: string) => {
      setSelectedItems([...selectedItems, item]);
    },
    [selectedItems, setSelectedItems]
  );

  const deselectItem = useCallback(
    (item: string) => {
      setSelectedItems(selectedItems.filter(candidate => candidate !== item));
    },
    [selectedItems, setSelectedItems]
  );

  const isItemSelected = useCallback(
    (item: string) => {
      return selectedItems.includes(item);
    },
    [selectedItems]
  );

  const onItemSelect = useCallback(
    (item: string) => {
      if (isItemSelected(item)) {
        deselectItem(item);
      } else {
        selectItem(item);
      }
    },
    [isItemSelected, selectItem, deselectItem]
  );

  const onRemoveTag = useCallback((item: string) => deselectItem(item), [deselectItem]);

  const itemRenderer = useCallback(
    (item: string, { handleClick, modifiers, index }: IItemRendererProps) => {
      if (!modifiers.matchesPredicate) {
        return null;
      }

      return (
        <MenuItem
          active={modifiers.active}
          icon={isItemSelected(item) ? "tick" : "blank"}
          key={item}
          onClick={handleClick}
          text={item}
          shouldDismissPopover={false}
        />
      );
    },
    [isItemSelected]
  );

  const tagRenderer = useCallback((x: string) => x, []);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }
      const startIndex = result.source.index;
      const endIndex = result.destination.index;
      const final = [...reorderedSelectedItems];
      const [removed] = final.splice(startIndex, 1);
      final.splice(endIndex, 0, removed);
      setReorderedSelectedItems(final);
    },
    [reorderedSelectedItems, setReorderedSelectedItems]
  );

  const clearButton =
    selectedItems.length > 0 ? (
      <Tooltip content="Clear Selection">
        <Button
          icon="cross"
          minimal={true}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            setSelectedItems([]);
          }}
        />
      </Tooltip>
    ) : (
      undefined
    );

  const reorderButton =
    selectedItems.length > 1 ? (
      <Tooltip content="Reorder Selection">
        <Button
          icon="sort"
          minimal={true}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            handleOpenReorder();
          }}
        />
      </Tooltip>
    ) : (
      undefined
    );

  const rightElement = (
    <ButtonGroup>
      {reorderButton}
      {clearButton}
    </ButtonGroup>
  );

  return (
    <>
      <Card className="app-layout" elevation={Elevation.TWO}>
        <MultiSelect<string>
          items={[...countries]}
          itemPredicate={filterDay}
          selectedItems={selectedItems}
          tagRenderer={tagRenderer}
          itemRenderer={itemRenderer}
          onItemSelect={onItemSelect}
          popoverProps={{ minimal: true }}
          tagInputProps={{ onRemove: onRemoveTag, rightElement }}
          itemsEqual={areDaysEqual}
          fill={true}
          resetOnSelect={true}
          className="app-days-select"
        />
      </Card>

      <Dialog
        isOpen={showReorder}
        canOutsideClickClose={true}
        onClose={() => handleCloseReorder(false)}
        title="Reorder"
        className="bp3-dark"
      >
        <div className={Classes.DIALOG_BODY}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="reorder-countries">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {reorderedSelectedItems.map((item, index) => (
                    <Draggable key={item} draggableId={item} index={index}>
                      {innerProvided => (
                        <p
                          ref={innerProvided.innerRef}
                          {...innerProvided.draggableProps}
                          {...innerProvided.dragHandleProps}
                          style={innerProvided.draggableProps.style}
                          className="app-reorderable"
                        >
                          <Icon
                            icon="drag-handle-horizontal"
                            className={"app-reorder-handle"}
                          />
                          {item}
                        </p>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => handleCloseReorder(false)}>Cancel</Button>
            <Button intent={Intent.PRIMARY} onClick={() => handleCloseReorder(true)}>
              Reorder
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

const areDaysEqual = (left: string, right: string) => {
  return left.toLowerCase() === right.toLowerCase();
};

const filterDay: ItemPredicate<string> = (query, item, _index, exactMatch) => {
  const normalisedItem = item.toLowerCase();
  const normalisedQuery = query.toLowerCase();
  if (exactMatch) {
    return normalisedItem === normalisedQuery;
  } else {
    return normalisedItem.indexOf(normalisedQuery) >= 0;
  }
};

export default App;
