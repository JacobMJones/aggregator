import React from "react";
import speech from '../../text-to-speech/index'
const SentenceFrequency = ({ state }) => {
 
  let category;
  let categoryValue;

  const randomProperty = function(obj) {
    var keys = Object.keys(obj);
    const randomIndex = Math.ceil(Math.random() * keys.length);
    categoryValue = Object.entries(obj)[randomIndex][0];
    category = Object.entries(obj)[randomIndex][1];

    //speech(`You have did a ${categoryValue} ${state.categoryValueTime[category][categoryValue].length} times in the past ${state.dayTimeCategoryValue.length} days`)

    return obj[keys[(keys.length * Math.random()) << 0]];
  };
  randomProperty(state.categoryValueToCategoryIndex);


  return (
    <>
      {" "}
      <>
        <h1>Random frequency sentence</h1>
        <div>
          You have did a {categoryValue}{" "}
          {state.categoryValueTime[category][categoryValue].length} times in
          the past {state.dayTimeCategoryValue.length} days
        </div>
      </>
    </>
  );
};

export default SentenceFrequency;
