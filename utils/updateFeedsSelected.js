import cloneDeep from "lodash/cloneDeep";

export const updateFeedsSelected = (type, feedsSelected) => {
  if (feedsSelected.includes(type)) {
    let clonedItems = cloneDeep(feedsSelected);
    let index = clonedItems.indexOf(type);
    clonedItems.splice(index, 1);
    return clonedItems;
  } else {
    let clonedItems = cloneDeep(feedsSelected);
    let items = clonedItems.concat(type);
    return items;
  }
};
