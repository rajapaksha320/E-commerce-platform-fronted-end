
// class merger utility

export const mergeClasses = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
