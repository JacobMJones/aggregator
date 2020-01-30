import Speech from "speak-tts";

export default function textToSpeech(text) {
  const speech = new Speech();
  speech
    .init({
      volume: 0.5,
      lang: "en-GB",
      rate: 2,
      pitch: 1,
      voice: "Google Bahasa Indonesia",
      splitSentences: false,
      listeners: {
        onvoiceschanged: voices => {
          console.log("Voices changed", voices);
        }
      }
    })
    .then(data => {
      console.log("Speech is ready", data);
    })
    .catch(e => {
      console.error("An error occured while initializing : ", e);
    });
  speech
    .speak({
      text: text
    })
    .then(() => {
      console.log("Success !");
    })
    .catch(e => {
      console.error("An error occurred :", e);
    });
}
