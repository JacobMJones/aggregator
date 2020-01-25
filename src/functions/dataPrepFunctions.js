export default {
  onlyUnique: function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  },

  fetchCsv: function fetchCsv(csv) {
    return fetch(csv).then(function(response) {
      let reader = response.body.getReader();
      let decoder = new TextDecoder("utf-8");
      return reader.read().then(function(result) {
        return decoder.decode(result.value);
      });
    });
  }
};
