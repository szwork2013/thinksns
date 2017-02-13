let guidNumber = 0;

let guid  = () => {
  guidNumber++;
  return guidNumber;
};

export default guid;