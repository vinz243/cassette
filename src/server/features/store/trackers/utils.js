module.exports.formatToURL = function (str) {
  return str.replace(/\s/g, '+');
}

module.exports.extractBitrateFromName = function (str) {
  const matched = str.match(/((\d{3}).kbps|MP3.(\d{3}))/i);
  if (!matched) return -1;
  return matched[2] || matched[3];
}
