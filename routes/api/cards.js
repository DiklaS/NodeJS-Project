const express = require("express");
const router = express.Router();
const cardsServiceModel = require("../../model/cardsService/cardsService");
const normalizeCard = require("../../model/cardsService/helpers/normalizationCardService");
const cardsValidationService = require("../../validation/cardsValidationService");
const permissionsMiddleware = require("../../middleware/permissionsMiddleware");
const authmw = require("../../middleware/authMiddleware");
const generateBizNumber = require("../../model/mongodb/cards/helpers/generateBizNumber")

//1. ALL CARDS
router.get("/", async (req, res) => {
  try {
    const allCards = await cardsServiceModel.getAllCards();
    res.json(allCards);
  } catch (err) {
    res.status(400).json(err);
  }
});

//2. USER CARDS
router.get("/my-cards", authmw,
async (req, res) => {
  try {
    let user = req.userData;
    if (!user.isBusiness) return res.status(403).json("Un authorize user!");
    const cards = await cardsServiceModel.getMyCards({user_id: user._id});
    return res.send(cards);
  } catch (error) {
    //console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

//3. CARD
router.get("/:id", async (req, res) => {
  try {
    await cardsValidationService.cardIdValidation(req.params.id);
    const cardFromDB = await cardsServiceModel.getCardById(req.params.id);
    res.json(cardFromDB);
  } catch (err) {
    res.status(400).json(err);
  }
});

//4. CREATE NEW CARD
/* router.post("/", authmw,
permissionsMiddleware(true, false, false),
async (req, res) => {
  try {
    await cardsValidationService.createCardValidation(req.body);
    let normalCard = await normalizeCard(req.body, req.userData._id);
    const dataFromMongoose = await cardsServiceModel.createCard(normalCard);
    console.log("dikla");
    console.log("dataFromMongoose", dataFromMongoose);
    res.json({ msg: "A new card 'was created" });
  } catch (err) {
    res.status(400).json(err);
  }
}); */

// biz only
router.post("/", authmw, async (req, res) => {
  try {
    await cardsValidationService.createCardValidation(req.body);
    let normalCard = await normalizeCard(req.body, req.userData._id);
    const dataFromMongoose = await cardsServiceModel.createCard(normalCard);
    console.log("dataFromMongoose", dataFromMongoose);
    res.json(dataFromMongoose);
  } catch (err) {
    res.status(400).json(err);
  }
});

//5. EDIT CARD
router.put("/:id", authmw,
permissionsMiddleware(false, false, true),
async (req, res) => {
  try {
    await cardsValidationService.cardIdValidation(req.params.id);
    await cardsValidationService.createCardValidation(req.body);
    let normalCard = await normalizeCard(req.body, req.userData._id);
    const cardFromDB = await cardsServiceModel.updateCard(
      req.params.id,
      normalCard
    );
    res.json(cardFromDB);
  } catch (err) {
    res.status(400).json(err);
  }
});

/* // admin or biz owner
router.put("/:id", async (req, res) => {
  try {
    //! joi validation
    //! normalize
    const cardFromDB = await cardsServiceModel.updateCard(
      req.params.id,
      req.body
    );
    res.json(cardFromDB);
  } catch (err) {
    res.status(400).json(err);
  }
}); */

//6. LIKE CARD
router.patch("/:id", authmw, async (req, res) => {
  try {
    await cardsValidationService.cardIdValidation(req.params.id);
    let card = await cardsServiceModel.getCardById(req.params.id);
    const user = req.userData;
    const cardLike = card.likes.find((id) => id === user._id);

    if (!cardLike) {
      card.likes.push(user._id);
      card = await card.save();
      return res.send(card);
    }
    const cardLikes = card.likes.filter((id) => id !== user._id);
    card.likes = cardLikes;
    card = await card.save();
    return res.send(card);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//7. DELETE CARD
router.delete(
  "/:id", authmw,
  permissionsMiddleware(false, true, true),
  async (req, res) => {
    try {
      await cardsValidationService.cardIdValidation(req.params.id);
      const cardFromDB = await cardsServiceModel.deleteCard(req.params.id);
      if (cardFromDB) {
        res.json({ msg: "card deleted" });
      } else {
        res.json({ msg: "could not find the card" });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//8.BONUS- CHANGE BUSINESS NUMBER
router.patch("/bizNumber/:id", authmw,
permissionsMiddleware(false, true, false),
async (req, res) => {
  try {
    const card = await cardsServiceModel.updateCard(req.params.id, {
      bizNumber: await generateBizNumber(),
    });
    return res.send(card);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;