import React from "react";
import { CategoryResult } from "types/results/category/category.result";
import styles from "../index.module.scss";

export default ({
  item,
  index,
  activeIndex,
  setCategoryActive,
  setActiveIndex
}: {
  item: CategoryResult;
  index: number;
  activeIndex: number;
  setCategoryActive: React.Dispatch<React.SetStateAction<number>>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <li
      key={index}
      className={index === activeIndex ? "menu-line text_category_active" : ``}
      onClick={() => [
        setCategoryActive(item.id),
        setActiveIndex(index),
      ]}
    >
      {item.name}
    </li>
  )
};
