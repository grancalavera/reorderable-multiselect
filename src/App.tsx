import React, { useState, useCallback } from "react";
import "./App.css";
import { MultiSelect, IItemRendererProps, ItemPredicate } from "@blueprintjs/select";
import { MenuItem } from "@blueprintjs/core";

type DayOfTheWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const daysOfTheWeek: DayOfTheWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DaysSelect = MultiSelect.ofType<DayOfTheWeek>();

function App() {
  const [selectedItems, setSelectedItems] = useState<DayOfTheWeek[]>([]);

  const selectItem = useCallback(
    (item: DayOfTheWeek) => {
      setSelectedItems([...selectedItems, item]);
    },
    [selectedItems, setSelectedItems]
  );

  const deselectItem = useCallback(
    (item: DayOfTheWeek) => {
      setSelectedItems(selectedItems.filter(candidate => candidate !== item));
    },
    [selectedItems, setSelectedItems]
  );

  const isItemSelected = useCallback(
    (item: DayOfTheWeek) => {
      return selectedItems.includes(item);
    },
    [selectedItems]
  );

  const onItemSelect = useCallback(
    (item: DayOfTheWeek) => {
      if (isItemSelected(item)) {
        deselectItem(item);
      } else {
        selectItem(item);
      }
    },
    [isItemSelected, selectItem, deselectItem]
  );

  const onRemoveTag = useCallback((item: string) => deselectItem(item as DayOfTheWeek), [
    deselectItem,
  ]);

  const itemRenderer = useCallback(
    (item: DayOfTheWeek, { handleClick, modifiers, index }: IItemRendererProps) => {
      if (!modifiers.matchesPredicate) {
        return null;
      }

      return (
        <MenuItem
          active={modifiers.active}
          icon={isItemSelected(item) ? "tick" : "blank"}
          key={item}
          label={(index || 0) % 3 === 0 ? "BP" : ""}
          onClick={handleClick}
          text={item}
          shouldDismissPopover={false}
        />
      );
    },
    [isItemSelected]
  );

  const tagRenderer = useCallback((x: DayOfTheWeek) => x, []);

  return (
    <div className="app-layout" style={{ color: "white" }}>
      <DaysSelect
        items={daysOfTheWeek}
        itemPredicate={filterDay}
        selectedItems={selectedItems}
        tagRenderer={tagRenderer}
        itemRenderer={itemRenderer}
        onItemSelect={onItemSelect}
        popoverProps={{ minimal: true }}
        openOnKeyDown={true}
        tagInputProps={{ onRemove: onRemoveTag }}
        itemsEqual={areDaysEqual}
        fill={true}
        resetOnSelect={true}
      />
    </div>
  );
}

const areDaysEqual = (left: DayOfTheWeek, right: DayOfTheWeek) => {
  return left.toLowerCase() === right.toLowerCase();
};

const filterDay: ItemPredicate<DayOfTheWeek> = (query, item, _index, exactMatch) => {
  const normalisedItem = item.toLowerCase();
  const normalisedQuery = query.toLowerCase();
  if (exactMatch) {
    return normalisedItem === normalisedQuery;
  } else {
    return normalisedItem.indexOf(normalisedQuery) >= 0;
  }
};

export default App;
