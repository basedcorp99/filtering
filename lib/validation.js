export const validateStreamName = (name) => /^[a-zA-Z0-9]+$/.test(name);
export const validateUrl = (url) =>
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(url);

