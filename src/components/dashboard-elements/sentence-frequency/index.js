import React from "react";
import speech from "../../text-to-speech/index";

const SentenceFrequency = ({ state }) => {
  const obj = state.categoryValueToCategoryIndex;
  const keys = Object.keys(obj);
  const randomIndex = Math.ceil(Math.random() * keys.length);
  const categoryValue = Object.entries(obj)[randomIndex][0];
  const category = Object.entries(obj)[randomIndex][1];

  return (
    <>
      <h1>Random frequency sentence</h1>
      <div>
        You have did a {categoryValue}{" "}
        {state.categoryValueTime[category][categoryValue].length} times in the
        past {state.dayTimeCategoryValue.length} days
      </div>
    </>
  );
};

export default SentenceFrequency;
