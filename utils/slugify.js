const slugify = require("slugify");

const generateSlug = (sentence) => {
  return slugify(sentence, {
    replacement: "-",
    lower: true,
  });
};

module.exports = { generateSlug };
