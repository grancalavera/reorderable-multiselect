import {
  Button,
  Card,
  Classes,
  Dialog,
  Elevation,
  Intent,
  MenuItem,
  Icon,
} from "@blueprintjs/core";
import { IItemRendererProps, ItemPredicate, MultiSelect } from "@blueprintjs/select";
import classnames from "classnames";
import React, { useCallback, useState } from "react";
import { DragDropContext, Droppable, DropResult, Draggable } from "react-beautiful-dnd";
import "./App.css";

const itemList = countries();

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

  return (
    <>
      <Card className="app-layout" elevation={Elevation.TWO}>
        <MultiSelect<string>
          items={itemList}
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
          className="app-days-select"
        />

        <Button
          disabled={selectedItems.length < 2}
          minimal={true}
          onClick={handleOpenReorder}
        >
          Reorder
        </Button>
      </Card>
      <Dialog
        isOpen={showReorder}
        canOutsideClickClose={true}
        onClose={() => handleCloseReorder(false)}
        className={classnames("bp3-dark")}
        title="Reorder"
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
              Apply
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

function countries() {
  return [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua & Deps",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Central African Rep",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo {Democratic Rep}",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland {Republic}",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea North",
    "Korea South",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar, {Burma}",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "St Kitts & Nevis",
    "St Lucia",
    "Saint Vincent & the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome & Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad & Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];
}
export default App;
