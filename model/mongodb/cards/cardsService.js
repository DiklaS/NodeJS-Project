const Card = require("./Card");

const createCard = (cardToSave) => {
  let card = new Card(cardToSave);
  return card.save();
};

const getAllCards = () => {
  return Card.find();
};

const getMyCards = (userId) => {
  return Card.find(userId);
};

const getCardById = (id) => {
  return Card.findById(id);
};

const getCardByBizNumber = (bizNumber) => {
  return Card.findOne({ bizNumber }, { bizNumber: 1, _id: 0 });
};

const updateCard = (id, cardToUpdate) => {
  return Card.findByIdAndUpdate(id, cardToUpdate, {
    new: true,
  });
};

const deleteCard = (id) => {
  return Card.findByIdAndDelete(id);
};

const changeBizCard = (bizId, bizNumberToUpdate) => {
  return Card.findByIdAndUpdate(Number(bizId), bizNumberToUpdate)
} 





module.exports = {
  createCard,
  getAllCards,
  getMyCards,
  getCardById,
  getCardByBizNumber,
  updateCard,
  deleteCard,
  changeBizCard
  
};
