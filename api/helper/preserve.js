export default {
  encodeNewLineAndQuote(text) {
    return text.replaceAll("'", "%27").replaceAll("\n", "%0A");
  },
  decodeNewLineAndQuote(text) {
    return text.replaceAll("%27", "'").replaceAll("%0A", "\n");
  },
};
